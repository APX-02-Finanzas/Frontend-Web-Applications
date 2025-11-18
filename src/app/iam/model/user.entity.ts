export type Role = 'ROLE_SALESMAN' | 'ROLE_MANAGER';
export class User {
  id: number;
  username: string;
  token: string;
  roles: Role[];
  name?: string;
  surname?: string;

  constructor(user:{id?: number, username?: string, token?: string, roles?: Role[], name?: string, surname?: string}) {
    this.id = user.id || 0;
    this.username = user.username || '';
    this.token = user.token || '';
    this.roles = user.roles || [];
    this.name = user.name || '';
    this.surname = user.surname || '';
  }
}
