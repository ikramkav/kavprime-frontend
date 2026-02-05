'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  
  Divider,
  Stack,
  Alert,
  Avatar,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  Checklist as ChecklistIcon
} from '@mui/icons-material';
import AddWorkflowDialog from './AddWorkflowDialog';
import { useGetWorkflowsQuery, useGetRolesQuery } from '@/redux/services/workflow/workflowApi';

// Type definitions
interface Role {
  id: number;
  name: string;
  is_active: boolean;
}

interface WorkflowStep {
  step_order: number;
  role: string;
  sla_hours: number;
}

interface Workflow {
  workflow_id: number;
  ticket_type: string;
  version: number;
  workflow_name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  steps: WorkflowStep[];
}

const WorkflowPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  // API Hooks
  const { data: workflowsData = [], isLoading: workflowsLoading, refetch: refetchWorkflows } = useGetWorkflowsQuery();
  const { data: rolesData = [] } = useGetRolesQuery();

  useEffect(() => {
  if (!workflowsLoading) {
    console.log("Workflows API response:", workflowsData);
  }
}, [workflowsData, workflowsLoading]);

  // Generate consistent colors for roles
  const roleColorMap: { [key: string]: string } = {
    'Employee': '#2196f3',
    'TEAM_PMO': '#4caf50',
    'SENIOR_PMO': '#ff9800',
    'ADMIN': '#f44336',
    'FINANCE': '#9c27b0'
  };

  const getRoleColor = (roleName: string): string => {
    return roleColorMap[roleName] || `hsl(${(roleName.charCodeAt(0) * 60) % 360}, 70%, 50%)`;
  };

  // Handle opening dialog for new workflow
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Handle closing dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle saving workflow
  const handleSaveWorkflow = () => {
    refetchWorkflows();
    handleCloseDialog();
  };

  // Handle closing success notification
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  if (workflowsLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Workflow Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage workflows for your organization. Configure roles and steps for each workflow.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ borderRadius: 2 }}
          >
            Create New Workflow
          </Button>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip
              label={`${rolesData.length} Roles Available`}
              variant="outlined"
            />
            <Chip
              label={`${workflowsData.length} Workflows`}
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Workflows determine how tickets are processed through your organization. Each workflow can have different roles and approval steps.
      </Alert>

      {/* Workflows Grid */}
      {workflowsData.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="textSecondary" sx={{ mb: 2 }}>
            No workflows created yet.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Create Your First Workflow
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {workflowsData.map((workflow) => (
            <Box key={workflow.workflow_id}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  width: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Workflow Title and Status */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h2" fontWeight="600" sx={{ wordBreak: 'break-word' }}>
                        {workflow.workflow_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        v{workflow.version}
                      </Typography>
                    </Box>
                    <Chip
                      label={workflow.is_active ? "Active" : "Inactive"}
                      color={workflow.is_active ? "success" : "default"}
                      size="small"
                      sx={{ flexShrink: 0 }}
                    />
                  </Box>

                  {/* Description */}
                  {workflow.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                      {workflow.description}
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Steps Section */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="500" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ChecklistIcon fontSize="small" /> Flow Steps ({workflow.steps.length})
                    </Typography>
                    <Stack spacing={1}>
                      {workflow.steps && workflow.steps.length > 0 ? (
                        workflow.steps.map((step, index) => {
                          const roleColor = getRoleColor(step.role);
                          return (
                            <Box key={`${workflow.workflow_id}-step-${step.step_order}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                sx={{
                                  width: 28,
                                  height: 28,
                                  bgcolor: roleColor,
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                  flexShrink: 0
                                }}
                              >
                                {step.step_order}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 500, minWidth: '80px' }}>
                                {step.role}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                {step.sla_hours}h
                              </Typography>
                              {index < workflow.steps.length - 1 && (
                                <ArrowForwardIcon fontSize="small" sx={{ color: 'text.disabled', ml: 'auto' }} />
                              )}
                            </Box>
                          );
                        })
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No steps defined
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  {/* Metadata */}
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(workflow.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>

                <Divider />

                {/* Card Actions */}
                <CardActions sx={{ justifyContent: 'flex-end', p: 2, gap: 1 }}>
                  <IconButton
                    size="small"
                    title="Edit Workflow"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    title="Delete Workflow"
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Create/Edit Workflow Dialog Component */}
      <AddWorkflowDialog
        open={openDialog}
        editingWorkflow={null}
        onClose={handleCloseDialog}
        onSave={handleSaveWorkflow}
      />

      {/* Success Notification */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WorkflowPage;