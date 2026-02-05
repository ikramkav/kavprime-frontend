// src/app/dashboard/accounts/page.tsx
"use client";

import React, { useState } from "react";
import { Box, Button, Paper, Typography, useTheme, Tabs, Tab } from "@mui/material";
import { Add, AdminPanelSettings, People } from "@mui/icons-material";
import { useGetUsersQuery, User } from "@/redux/services/auth/authApi";
import { useGetRolesQuery, Role } from "@/redux/services/roles/rolesApi";
import UserTable from "./UserTable";
import RoleTable from "./RoleTable";
import AddUserDialog from "./AddUserDialog";
import EditUserDialog from "./EditUserDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import AddRoleDialog from "./AddRoleDialog";
import ToggleRoleDialog from "./ToggleRoleDialog";

export default function AccountManagement() {
  const theme = useTheme();
  const { data: userData, isLoading: usersLoading, isError: usersError } = useGetUsersQuery();
  const { data: rolesData, isLoading: rolesLoading, isError: rolesError } = useGetRolesQuery();

  const [activeTab, setActiveTab] = useState(0);

  // User Management States
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Role Management States
  const [addRoleDialogOpen, setAddRoleDialogOpen] = useState(false);
  const [toggleRoleDialogOpen, setToggleRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteUserDialogOpen(true);
  };

  const handleToggleRole = (role: Role) => {
    setSelectedRole(role);
    setToggleRoleDialogOpen(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            Account Management
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            {activeTab === 0
              ? "Manage user accounts and permissions"
              : "Manage system and custom roles"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() =>
            activeTab === 0 ? setAddUserDialogOpen(true) : setAddRoleDialogOpen(true)
          }
          sx={{
            textTransform: "none",
            px: 3,
            py: 1.2,
            borderRadius: "10px",
          }}
        >
          {activeTab === 0 ? "Add User" : "Add Role"}
        </Button>
      </Box>

      {/* Tabs */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            px: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              minHeight: "56px",
            },
          }}
        >
          <Tab
            icon={<People sx={{ fontSize: 20, mr: 1 }} />}
            iconPosition="start"
            label="Users"
          />
          <Tab
            icon={<AdminPanelSettings sx={{ fontSize: 20, mr: 1 }} />}
            iconPosition="start"
            label="Roles"
          />
        </Tabs>

        <Box sx={{ p: 0 }}>
          {/* User Management Tab */}
          {activeTab === 0 && (
            <UserTable
              users={userData?.users || []}
              isLoading={usersLoading}
              isError={usersError}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          )}

          {/* Role Management Tab */}
          {activeTab === 1 && (
            <RoleTable
              roles={rolesData || []}
              isLoading={rolesLoading}
              isError={rolesError}
              onToggleStatus={handleToggleRole}
            />
          )}
        </Box>
      </Paper>

      {/* User Dialogs */}
      <AddUserDialog
        open={addUserDialogOpen}
        onClose={() => setAddUserDialogOpen(false)}
      />

      <EditUserDialog
        open={editUserDialogOpen}
        user={selectedUser}
        onClose={() => {
          setEditUserDialogOpen(false);
          setSelectedUser(null);
        }}
      />

      <DeleteConfirmDialog
        open={deleteUserDialogOpen}
        user={selectedUser}
        onClose={() => {
          setDeleteUserDialogOpen(false);
          setSelectedUser(null);
        }}
      />

      {/* Role Dialogs */}
      <AddRoleDialog
        open={addRoleDialogOpen}
        onClose={() => setAddRoleDialogOpen(false)}
      />

      <ToggleRoleDialog
        open={toggleRoleDialogOpen}
        role={selectedRole}
        onClose={() => {
          setToggleRoleDialogOpen(false);
          setSelectedRole(null);
        }}
      />
    </Box>
  );
}