"use client";

import React from "react";
import { Box, Typography, Paper, Stack, Chip } from "@mui/material";

// Types for workflow step
interface WorkflowStep {
  step_order: number;
  role: string;
  target_role: string;
  sla_hours: number;
  assigned_to?: string; // Name of the user assigned to this step
  status?: "PENDING" | "APPROVED" | "REJECTED"; // optional
}

interface WorkflowStepsProps {
  steps: WorkflowStep[];
}

export default function WorkflowSteps({ steps }: WorkflowStepsProps) {
  if (!steps || steps.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        No workflow steps assigned.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Workflow Steps
      </Typography>

      <Stack spacing={2}>
        {steps
          .sort((a, b) => a.step_order - b.step_order)
          .map((step) => (
            <Paper
              key={step.step_order}
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  Step {step.step_order}: {step.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Assigned To: {step.assigned_to || "Not Assigned"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Target Role: {step.target_role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SLA: {step.sla_hours} hour(s)
                </Typography>
              </Box>

              {step.status && (
                <Chip
                  label={step.status}
                  color={
                    step.status === "APPROVED"
                      ? "success"
                      : step.status === "REJECTED"
                      ? "error"
                      : "warning"
                  }
                  size="small"
                />
              )}
            </Paper>
          ))}
      </Stack>
    </Box>
  );
}
