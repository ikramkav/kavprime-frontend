// components/WorkflowDialog.tsx
"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Stack,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useCreateWorkflowMutation } from "@/redux/services/workflow/workflowApi";
import { useGetRolesQuery } from "@/redux/services/workflow/workflowApi";

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

interface RoleWorkflow {
  role: string;
  steps: WorkflowStepDetail[];
}

interface WorkflowDialogProps {
  open: boolean;
  editingWorkflow: any;
  onClose: () => void;
  onSave: () => void;
}

const AddWorkflowDialog = ({
  open,
  editingWorkflow,
  onClose,
  onSave,
}: WorkflowDialogProps) => {
  const [workflowName, setWorkflowName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ticketType, setTicketType] = useState<string>("");
  const [roleWorkflows, setRoleWorkflows] = useState<RoleWorkflow[]>([]);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  // API Hooks
  const { data: rolesData = [] } = useGetRolesQuery();
  const [createWorkflow, { isLoading: isCreating }] =
    useCreateWorkflowMutation();

  const availableRoles = rolesData.filter((role) => role.is_active);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setWorkflowName("");
      setDescription("");
      setTicketType("");
      setRoleWorkflows([]);
      setError("");
      setShowSuccess(false);
    }
  }, [open]);

  // Handle workflow name change
  const handleNameChange = (value: string) => {
    setWorkflowName(value);
  };

  // Handle description change
  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  // Handle ticket type change
  const handleTicketTypeChange = (value: string) => {
    setTicketType(value);
  };

  // Add new role workflow
  const handleAddRoleWorkflow = () => {
    const newRoleWorkflow: RoleWorkflow = {
      role: "",
      steps: [{ step_order: getNextStepOrder(), target_role: "", sla_hours: 0 }],
    };
    setRoleWorkflows([...roleWorkflows, newRoleWorkflow]);
  };

  // Remove role workflow
  const handleRemoveRoleWorkflow = (index: number) => {
    const newRoleWorkflows = roleWorkflows.filter((_, idx) => idx !== index);
    setRoleWorkflows(newRoleWorkflows);
  };

  // Handle role change for a role workflow
  const handleRoleChange = (index: number, roleName: string) => {
    const newRoleWorkflows = [...roleWorkflows];
    newRoleWorkflows[index].role = roleName;
    setRoleWorkflows(newRoleWorkflows);
  };

  // Add step to a specific role workflow
  const handleAddStep = (roleIndex: number) => {
    const newRoleWorkflows = [...roleWorkflows];
    const newStep: WorkflowStepDetail = {
      step_order: getNextStepOrder(),
      target_role: "",
      sla_hours: 0,
    };
    newRoleWorkflows[roleIndex].steps.push(newStep);
    setRoleWorkflows(newRoleWorkflows);
  };

  // Remove step from a specific role workflow
  const handleRemoveStep = (roleIndex: number, stepIndex: number) => {
    const newRoleWorkflows = [...roleWorkflows];
    if (newRoleWorkflows[roleIndex].steps.length > 1) {
      newRoleWorkflows[roleIndex].steps.splice(stepIndex, 1);
      // Recalculate step orders after removal
      recalculateStepOrders(newRoleWorkflows);
      setRoleWorkflows(newRoleWorkflows);
    }
  };

  // Handle target role change for a step
  const handleTargetRoleChange = (
    roleIndex: number,
    stepIndex: number,
    targetRole: string
  ) => {
    const newRoleWorkflows = [...roleWorkflows];
    newRoleWorkflows[roleIndex].steps[stepIndex].target_role = targetRole;
    setRoleWorkflows(newRoleWorkflows);
  };

  // Handle SLA hours change for a step
  const handleSlaChange = (
    roleIndex: number,
    stepIndex: number,
    slaHours: string
  ) => {
    const newRoleWorkflows = [...roleWorkflows];
    newRoleWorkflows[roleIndex].steps[stepIndex].sla_hours =
      Number(slaHours) || 0;
    setRoleWorkflows(newRoleWorkflows);
  };

  // Get next step order globally
  const getNextStepOrder = (): number => {
    let maxOrder = 0;
    roleWorkflows.forEach((roleWorkflow) => {
      roleWorkflow.steps.forEach((step) => {
        if (step.step_order > maxOrder) {
          maxOrder = step.step_order;
        }
      });
    });
    return maxOrder + 1;
  };

  // Recalculate step orders to ensure they are sequential
  const recalculateStepOrders = (workflows: RoleWorkflow[]) => {
    let stepOrder = 1;
    workflows.forEach((roleWorkflow) => {
      roleWorkflow.steps.forEach((step) => {
        step.step_order = stepOrder;
        stepOrder++;
      });
    });
  };

  // Get already selected roles (main roles)
  const selectedMainRoles = roleWorkflows
    .map((rw) => rw.role)
    .filter((role) => role !== "");

  // Get available roles for main role dropdown
  const getAvailableMainRoles = (currentIndex: number) => {
    const currentRole = roleWorkflows[currentIndex].role;
    return availableRoles.filter(
      (role) =>
        role.name === currentRole || !selectedMainRoles.includes(role.name)
    );
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!workflowName.trim()) {
      setError("Workflow Name is required");
      return false;
    }

    if (!description.trim()) {
      setError("Description is required");
      return false;
    }

    if (roleWorkflows.length === 0) {
      setError("Please add at least one role with steps");
      return false;
    }

    for (let roleWorkflow of roleWorkflows) {
      if (!roleWorkflow.role) {
        setError("All roles must be selected");
        return false;
      }

      if (roleWorkflow.steps.length === 0) {
        setError(`Role "${roleWorkflow.role}" must have at least one step`);
        return false;
      }

      for (let step of roleWorkflow.steps) {
        if (!step.target_role) {
          setError(`All steps must have a target role selected`);
          return false;
        }

        if (!step.sla_hours || step.sla_hours <= 0) {
          setError("Each step must have SLA hours greater than 0");
          return false;
        }
      }
    }

    return true;
  };

  // Create workflow
  const handleCreateWorkflow = async () => {
    try {
      setError("");

      if (!validateForm()) {
        return;
      }

      // Prepare the payload
      const workflowData = {
        ticket_type: ticketType.trim(),
        workflow_name: workflowName.trim(),
        description: description.trim(),
        is_active: true,
        roles: roleWorkflows.map((roleWorkflow) => ({
          role: roleWorkflow.role,
          steps: roleWorkflow.steps.map((step) => ({
            step_order: step.step_order,
            target_role: step.target_role,
            sla_hours: step.sla_hours,
          })),
        })),
      };

      console.log("Creating workflow with payload:", workflowData);

      // Call API
      const result = await createWorkflow(workflowData).unwrap();

      console.log("Workflow created successfully:", result);

      // Show success message
      setSuccessMessage(`Workflow "${workflowName}" created successfully!`);
      setShowSuccess(true);

      // Close dialog after delay
      setTimeout(() => {
        onClose();
        onSave();
      }, 1500);
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.data?.detail ||
        "Failed to create workflow. Please try again.";
      setError(errorMessage);
      console.error("Workflow creation error:", err);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Workflow</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            {/* Workflow Name */}
            <TextField
              autoFocus
              label="Workflow Name"
              fullWidth
              value={workflowName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Repair Workflow"
              disabled={isCreating}
            />

            {/* Ticket Type */}
            <TextField
              label="Ticket Type"
              fullWidth
              value={ticketType}
              onChange={(e) => handleTicketTypeChange(e.target.value)}
              placeholder="e.g., Repair an Item"
              disabled={isCreating}
            />

            {/* Description */}
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Describe this workflow"
              disabled={isCreating}
            />

            {/* Role Workflows */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  Roles & Steps ({roleWorkflows.length})
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleAddRoleWorkflow}
                  disabled={isCreating}
                  startIcon={<AddIcon />}
                >
                  Add Role
                </Button>
              </Box>

              <Stack spacing={3}>
                {roleWorkflows.map((roleWorkflow, roleIndex) => (
                  <Box
                    key={roleIndex}
                    sx={{
                      p: 2,
                      border: "2px solid",
                      borderColor: "primary.light",
                      borderRadius: 2,
                      bgcolor: "background.paper",
                    }}
                  >
                    {/* Role Selection */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "flex-start",
                        mb: 3,
                      }}
                    >
                      <FormControl fullWidth disabled={isCreating}>
                        <InputLabel>Select Main Role</InputLabel>
                        <Select
                          value={roleWorkflow.role}
                          onChange={(e) =>
                            handleRoleChange(roleIndex, e.target.value)
                          }
                          label="Select Main Role"
                        >
                          <MenuItem value="">
                            <em>Select a role...</em>
                          </MenuItem>
                          {getAvailableMainRoles(roleIndex).map((role) => (
                            <MenuItem key={role.id} value={role.name}>
                              {role.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {roleWorkflows.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveRoleWorkflow(roleIndex)}
                          disabled={isCreating}
                          sx={{
                            mt: 1,
                            color: "error.main",
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>

                    {/* Steps for this role */}
                    {roleWorkflow.role && (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              fontWeight: 600,
                              ml: 1,
                            }}
                          >
                            Steps ({roleWorkflow.steps.length})
                          </Typography>
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => handleAddStep(roleIndex)}
                            disabled={isCreating}
                            startIcon={<AddIcon />}
                          >
                            Add Step
                          </Button>
                        </Box>

                        <Stack spacing={2} sx={{ ml: 1 }}>
                          {roleWorkflow.steps.map((step, stepIndex) => (
                            <Box
                              key={stepIndex}
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "flex-start",
                                p: 1.5,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1,
                                bgcolor: "grey.50",
                              }}
                            >
                              {/* Step Order */}
                              <Box
                                sx={{
                                  minWidth: 35,
                                  pt: 1,
                                  textAlign: "center",
                                  fontWeight: 600,
                                  color: "primary.main",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {step.step_order}
                              </Box>

                              {/* Target Role Select */}
                              <FormControl fullWidth disabled={isCreating}>
                                <InputLabel>Target Role</InputLabel>
                                <Select
                                  value={step.target_role}
                                  onChange={(e) =>
                                    handleTargetRoleChange(
                                      roleIndex,
                                      stepIndex,
                                      e.target.value
                                    )
                                  }
                                  label="Target Role"
                                >
                                  <MenuItem value="">
                                    <em>Select target role...</em>
                                  </MenuItem>
                                  {availableRoles.map((role) => (
                                    <MenuItem
                                      key={role.id}
                                      value={role.name}
                                    >
                                      {role.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                              {/* SLA Hours */}
                              <TextField
                                label="SLA Hours"
                                type="number"
                                value={step.sla_hours || ""}
                                onChange={(e) =>
                                  handleSlaChange(roleIndex, stepIndex, e.target.value)
                                }
                                placeholder="0"
                                disabled={isCreating}
                                inputProps={{ min: "1" }}
                                sx={{ width: "120px" }}
                              />

                              {/* Delete Button */}
                              {roleWorkflow.steps.length > 1 && (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleRemoveStep(roleIndex, stepIndex)
                                  }
                                  disabled={isCreating}
                                  sx={{ mt: 0.5 }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Summary of all steps */}
            {roleWorkflows.length > 0 &&
              roleWorkflows.some((rw) => rw.role && rw.steps.length > 0) && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.secondary", mb: 2 }}
                  >
                    Workflow Summary:
                  </Typography>
                  <Stack spacing={2}>
                    {roleWorkflows.map((roleWorkflow, roleIndex) => (
                      <Box key={roleIndex}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "primary.main",
                            mb: 1,
                          }}
                        >
                          {roleWorkflow.role}
                        </Typography>
                        <Stack spacing={1} sx={{ ml: 2 }}>
                          {roleWorkflow.steps.map((step, stepIndex) => (
                            <Chip
                              key={stepIndex}
                              label={`Step ${step.step_order}: ${step.target_role} → ${step.sla_hours}h`}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateWorkflow}
            disabled={
              !workflowName.trim() ||
              !description.trim() ||
              roleWorkflows.length === 0 ||
              roleWorkflows.some((rw) => !rw.role || rw.steps.length === 0) ||
              isCreating
            }
          >
            {isCreating && <CircularProgress size={20} sx={{ mr: 1 }} />}
            Create Workflow
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Notification */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddWorkflowDialog;