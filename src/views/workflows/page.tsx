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
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  Checklist as ChecklistIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import AddWorkflowDialog from './AddWorkflowDialog';
import { useGetWorkflowsQuery, useGetRolesQuery } from '@/redux/services/workflow/workflowApi';

// Type definitions
interface Role {
  id: number;
  name: string;
  is_active: boolean;
}

interface WorkflowStepDetail {
  step_order: number;
  target_role: string;
  sla_hours: number;
}

interface RoleWorkflowSteps {
  role: string;
  steps: WorkflowStepDetail[];
}

interface Workflow {
  workflow_id: number;
  ticket_type: string;
  version?: number;
  workflow_name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  roles: RoleWorkflowSteps[];
}

const WorkflowPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedWorkflow, setExpandedWorkflow] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // API Hooks
  const {
    data: workflowsData = [],
    isLoading: workflowsLoading,
    refetch: refetchWorkflows,
  } = useGetWorkflowsQuery();
  const { data: rolesData = [] } = useGetRolesQuery();

  // Ensure hydration before rendering dynamic content
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!workflowsLoading && isHydrated) {
      console.log('Workflows API response:', workflowsData);
    }
  }, [workflowsData, workflowsLoading, isHydrated]);

  // Generate consistent colors for roles
  const roleColorMap: { [key: string]: string } = {
    Employee: '#2196f3',
    EMPLOYEE: '#2196f3',
    TEAM_PMO: '#4caf50',
    SENIOR_PMO: '#ff9800',
    ADMIN: '#f44336',
    FINANCE: '#9c27b0',
  };

  const getRoleColor = (roleName: string | null | undefined): string => {
    if (!roleName || typeof roleName !== 'string') {
      return '#757575'; // Default gray color
    }
    return (
      roleColorMap[roleName] ||
      `hsl(${(roleName.charCodeAt(0) * 60) % 360}, 70%, 50%)`
    );
  };

  // Get initials from role name
  const getRoleInitials = (roleName: string | null | undefined): string => {
    if (!roleName || typeof roleName !== 'string') {
      return '?';
    }
    return roleName
      .split('_')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

  // Handle accordion change
  const handleAccordionChange = (workflowId: number) => {
    setExpandedWorkflow(
      expandedWorkflow === workflowId ? null : workflowId
    );
  };

  if (workflowsLoading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          gutterBottom
        >
          Workflow Management
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Manage workflows for your organization. Configure roles and steps for
          each workflow.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ borderRadius: 2 }}
          >
            Create New Workflow
          </Button>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label={`${rolesData?.length || 0} Roles Available`}
              variant="outlined"
            />
            <Chip
              label={`${workflowsData?.length || 0} Workflows`}
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Workflows determine how tickets are processed through your
        organization. Each workflow can have different roles and approval
        steps.
      </Alert>

      {/* Workflows Grid */}
      {!isHydrated ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : !workflowsData || workflowsData.length === 0 ? (
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
        <Stack spacing={2}>
          {workflowsData.map((workflow) => {
            // Safely access roles array
            const workflowRoles = workflow?.roles || [];
            // Calculate total steps across all roles
            const totalSteps = workflowRoles.reduce(
              (sum, roleWorkflow) =>
                sum + (roleWorkflow?.steps?.length || 0),
              0
            );

            return (
              <Card
                key={workflow.workflow_id}
                elevation={2}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ pb: 0 }}>
                  {/* Workflow Title and Status */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        fontWeight="600"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {workflow.workflow_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {workflow.ticket_type && `${workflow.ticket_type} • `}
                        {workflow.version && `v${workflow.version}`}
                      </Typography>
                    </Box>
                    <Chip
                      label={workflow.is_active ? 'Active' : 'Inactive'}
                      color={workflow.is_active ? 'success' : 'default'}
                      size="small"
                      sx={{ flexShrink: 0 }}
                    />
                  </Box>

                  {/* Description */}
                  {workflow.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, lineHeight: 1.5 }}
                    >
                      {workflow.description}
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Roles Summary */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <ChecklistIcon fontSize="small" />
                      <Typography variant="subtitle2" fontWeight="500">
                        {workflowRoles.length} Role
                        {workflowRoles.length !== 1 ? 's' : ''} ({totalSteps}{' '}
                        Step{totalSteps !== 1 ? 's' : ''})
                      </Typography>
                    </Box>

                    {/* Role Workflows Accordion */}
                    {workflowRoles && workflowRoles.length > 0 ? (
                      <Stack spacing={1}>
                        {workflowRoles.map((roleWorkflow, roleIndex) => (
                          roleWorkflow ? (
                            <Accordion
                              key={`${workflow.workflow_id}-role-${roleIndex}`}
                              sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                '&:before': {
                                  display: 'none',
                                },
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                  backgroundColor: 'action.hover',
                                  py: 1,
                                }}
                              >
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: getRoleColor(roleWorkflow?.role),
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    mr: 1.5,
                                    flexShrink: 0,
                                  }}
                                >
                                  {getRoleInitials(roleWorkflow?.role)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" fontWeight="600">
                                    {roleWorkflow?.role || 'Unknown Role'}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {roleWorkflow?.steps?.length || 0} step
                                    {(roleWorkflow?.steps?.length || 0) !== 1
                                      ? 's'
                                      : ''}
                                  </Typography>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails sx={{ pt: 1.5, pb: 1.5 }}>
                                <Stack spacing={1}>
                                  {roleWorkflow?.steps &&
                                  roleWorkflow.steps.length > 0 ? (
                                    roleWorkflow.steps.map((step, stepIndex) => (
                                      <Box
                                        key={`${workflow.workflow_id}-step-${step?.step_order}`}
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 1.5,
                                          p: 1,
                                          bgcolor: 'grey.50',
                                          borderRadius: 1,
                                        }}
                                      >
                                        <Avatar
                                          sx={{
                                            width: 28,
                                            height: 28,
                                            bgcolor: getRoleColor(
                                              step?.target_role
                                            ),
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            flexShrink: 0,
                                          }}
                                        >
                                          {step?.step_order || stepIndex + 1}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                          <Typography
                                            variant="body2"
                                            fontWeight="500"
                                          >
                                            {step?.target_role || 'Unknown Role'}
                                          </Typography>
                                        </Box>
                                        <Box
                                          sx={{
                                            bgcolor: 'primary.light',
                                            color: 'primary.dark',
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 1,
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            flexShrink: 0,
                                          }}
                                        >
                                          {step?.sla_hours || 0}h
                                        </Box>
                                        {stepIndex <
                                          ((roleWorkflow?.steps?.length || 0) - 1) && (
                                          <ArrowForwardIcon
                                            fontSize="small"
                                            sx={{
                                              color: 'text.disabled',
                                              display: { xs: 'none', sm: 'block' },
                                            }}
                                          />
                                        )}
                                      </Box>
                                    ))
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      No steps defined
                                    </Typography>
                                  )}
                                </Stack>
                              </AccordionDetails>
                            </Accordion>
                          ) : null
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No roles defined
                      </Typography>
                    )}
                  </Box>

                  {/* Metadata */}
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Created:{' '}
                      {new Date(workflow.created_at).toLocaleDateString()}
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
            );
          })}
        </Stack>
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