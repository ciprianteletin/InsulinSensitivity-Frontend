export class DetailedUserModel {
  username: string;
  role: string;
  details: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNr: string;
    birthDay: string;
    joinDate: string;
    lastLoginDate: string;
    profileImageUrl?: string;
  };
}
