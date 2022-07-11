import React from 'react'

export interface UserType {
    userId: string
    username: string;
    password: string;
    email: string;
    privacySetting: enumPrivacySetting
    notificationFrequency: enumNotificationFrequency
    imageLink: string
}

export interface WorkspaceType {
    workspaceId: string,
    workspaceTitle: string,
    workspaceVisibility: enumWorkspaceVisibility,
    workspaceDescription: string,
    workspaceMembers: Array<WorkspaceMember>,
    workspaceBoardId: Array<String>
}

export interface BoardType {
    boardId: string,
    boardTitle: string,
    boardVisibility: enumBoardVisibility,
    boardDescription : string,
    boardWorkspaceId : string,
    boardMembers : Array<BoardMember>
}

export interface BoardMember {
    username: string,
    email: string,
    isAdmin: boolean
    docUserId?: string
}

export interface WorkspaceMember {
    username: string,
    email: string,
    isAdmin: string,
    docUserId?: string
}

export interface GrantRevokeWorksapce {
    userId: string,
    roleUser: string
}

export enum enumPrivacySetting {
    On = 'On',
    Off = 'Off'
}

export enum enumNotificationFrequency {
    Instant = 'Instant',
    Periodically = 'Periodically',
    Never = 'Never'
}

export enum enumWorkspaceVisibility {
    Public = 'Public',
    Private = 'Private'
}

export enum enumBoardVisibility {
    Private = 'Private',
    Workspace = "Workspace",
    Public = 'Public'
}