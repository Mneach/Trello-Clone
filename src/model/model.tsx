import React from 'react'
import { StringMappingType } from 'typescript';

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
    boardStatus : string
}

export interface BoardHomeType {
    boardId : string,
    boardTitle : string,
    boardWorkspaceId : string
    boardStatus : string
}

export interface BoardMember {
    username: string,
    email: string,
    isAdmin: string,
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

export interface WorkspaceInviteLinkType{
    linkId : string,
    link : string,
    timeExpired : number,
    workspaceId : string,
    workspaceTitle : string,
}

export interface WorkspaceInviteEmailType {
    inviteId : string,
    link : string,
    workspaceId : string,
    workspaceTitle : string,   
    userEmailInvited : string[]
}

export interface BoardInviteLinkType{
    linkId : string,
    link : string,
    timeExpired : number,
    boardId : string,
    boardTitle : string,
    boardWorkspaceId : string,
}

export interface BoardInviteEmailType {
    inviteId : string,
    link : string,
    boardId : string,
    boardTitle : string,
    boardWorkspaceId : string,   
    userEmailInvited : string[]
}

export interface sentEmailType {
    workspaceTitle : string,
    workspaceAdmin : string,
    toUser : string[],   
    link : string[]
}

export interface listType {
    listId :string,
    listName : string,
    cardList : Array<cardType>
}

export interface cardType {
    cardId : string,
    listId : string,
    boardId : string,
    workspaceId : string,
    cardName : string,
    cardDesc : string,
    cardLink : string,
    cardLatitude  : number,
    cardLongitude : number,
    cardLabel : Array<cardLabelType>
    cardDueDate : Array<cardDueDateType>
    cardLocation : Array<cardLocationType>
    cardComment : Array<cardCommentType>
    cardCheckList : Array<cardChecklistType>
}

export interface cardLabelType {

}

export interface cardDueDateType {

}

export interface cardLocationType {

}

export interface cardCommentType {
    userId : string,
    userEmail : string,
    comment : string,
    commentId : string,
    cardId : string,
}

export interface replyType {
    userId : string,
    userEmail : string,
    reply : string,
    commentId : string,
    replyId : string,
    cardId : string,
}

export interface cardChecklistType{
    checkListId : string,
    cardCheckList : string,
    checkListDone : boolean
}

export interface workspaceNotificaionType{
    workspaceNotificaionId : string,
    workspaceId : string,
    notificationTitle : string,
    notificationMessage : string

}

export interface mentionNotificationType { 
    userSend : string,
    mentionNotificationId : string,
    cardId: string,
    userMentionedId: string,
    userEmail: string,
    notificationTitle : string,
    notificationMessage : string,

}

export interface watcherNotifcationType { 
    cardId: string,
    userSend :string,
    userMentionedId:string,
    notificationTitle : string,
    notificationMessage : string
}

export interface cardWathcerType {
    watcherId : string,
    userId : string,
    cardId : string,
    cardWatcherName : string,
}

export interface reactMentionsType { 
    id : string,
    display : string,
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