export interface UpdateUserInfo {
    fullname?: string;
    email?: string;
  }
  
  export interface UpdateUserPassword {
    currentPassword: string;
    newPassword: string;
  }
  
  export interface UpdateUserStatus {
    isActive: boolean;
  }
  