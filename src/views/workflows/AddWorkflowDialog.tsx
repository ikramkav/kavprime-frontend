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
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useCreateWorkflowMutation } from "@/redux/services/workflow/workflowApi";
import { useGetRolesQuery } from "@/redux/services/workflow/workflowApi";

interface Role {
  id: number;
  name: string;
  is_active: boolean;
}

interface WorkflowStep {
  role: string;
  sla_hours: number;
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
  const [version, setVersion] = useState<string>("");
  const [steps, setSteps] = useState<WorkflowStep[]>([{ role: "", sla_hours: 0 }]);
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
      setVersion("");
      setSteps([{ role: "", sla_hours: 0 }]);
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

  // Handle version change
  const handleVersionChange = (value: string) => {
    setVersion(value);
  };

  // Handle step role change
  const handleStepRoleChange = (index: number, roleId: string) => {
    const newSteps = [...steps];
    newSteps[index].role = roleId;
    setSteps(newSteps);
  };

  // Handle step SLA hours change
  const handleStepSlaChange = (index: number, slaHours: string) => {
    const newSteps = [...steps];
    newSteps[index].sla_hours = Number(slaHours) || 0;
    setSteps(newSteps);
  };

  // Add new step
  const handleAddStep = () => {
    setSteps([...steps, { role: "", sla_hours: 0 }]);
  };

  // Remove step
  const handleRemoveStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, idx) => idx !== index);
      setSteps(newSteps);
    }
  };

  // Get already selected roles
  const selectedRoles = steps
    .map((step) => step.role)
    .filter((role) => role !== "");

  // Get available roles for a specific dropdown
  const getAvailableRolesForStep = (stepIndex: number) => {
    const currentRole = steps[stepIndex].role;
    return availableRoles.filter(
      (role) =>
        role.name === currentRole || !selectedRoles.includes(role.name)
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

    if (!version.trim()) {
      setError("Workflow Version is required");
      return false;
    }

    const validSteps = steps.filter((step) => step.role);
    if (validSteps.length === 0) {
      setError("Please add at least one step with a role");
      return false;
    }

    for (let step of validSteps) {
      if (!step.sla_hours || step.sla_hours <= 0) {
        setError("Each step must have SLA hours greater than 0");
        return false;
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

      // Filter out empty steps and prepare payload
      const validSteps = steps
        .filter((step) => step.role)
        .map((step) => ({
          role: step.role,
          sla_hours: step.sla_hours,
        }));

      const workflowData = {
        version: version.trim(),
        workflow_name: workflowName.trim(),
        description: description.trim(),
        steps: validSteps,
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
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
              placeholder="e.g., Support Ticket"
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

            {/* Workflow Version */}
            <TextField
              label="Workflow Version"
              fullWidth
              value={version}
              onChange={(e) => handleVersionChange(e.target.value)}
              placeholder="e.g., 1.0 or 10"
              disabled={isCreating}
            />

            {/* Workflow Steps */}
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
                  Workflow Steps ({steps.filter((s) => s.role).length})
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleAddStep}
                  disabled={isCreating}
                >
                  + Add Step
                </Button>
              </Box>

              <Stack spacing={2}>
                {steps.map((step, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "flex-start",
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      bgcolor: "background.paper",
                    }}
                  >
                    {/* Step Order */}
                    <Box
                      sx={{
                        minWidth: 40,
                        pt: 1,
                        textAlign: "center",
                        fontWeight: 600,
                        color: "primary.main",
                      }}
                    >
                      {index + 1}
                    </Box>

                    {/* Role Select */}
                    <FormControl fullWidth disabled={isCreating}>
                      <InputLabel>Select Role</InputLabel>
                      <Select
                        value={step.role}
                        onChange={(e) =>
                          handleStepRoleChange(index, e.target.value)
                        }
                        label="Select Role"
                      >
                        <MenuItem value="">
                          <em>Select a role...</em>
                        </MenuItem>
                        {getAvailableRolesForStep(index).map((role) => (
                          <MenuItem key={role.id} value={role.name}>
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
                        handleStepSlaChange(index, e.target.value)
                      }
                      placeholder="0"
                      disabled={isCreating}
                      inputProps={{ min: "1" }}
                      sx={{ width: "120px" }}
                    />

                    {/* Delete Button */}
                    {steps.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveStep(index)}
                        disabled={isCreating}
                        sx={{ mt: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Summary of steps */}
            {steps.filter((s) => s.role).length > 0 && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Steps Summary:
                </Typography>
                <Stack spacing={1}>
                  {steps
                    .filter((s) => s.role)
                    .map((step, index) => (
                      <Chip
                        key={index}
                        label={`Step ${index + 1}: ${step.role} (${step.sla_hours}h)`}
                        size="small"
                        variant="outlined"
                      />
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
              !version.trim() ||
              steps.filter((s) => s.role).length === 0 ||
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