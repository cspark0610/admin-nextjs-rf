export class BaseService {
  private static msUsers = 'ms-users/api/v1'
  private static msFands = 'ms-fands/api/v1'
  protected static getUsersUrl = () => this.msUsers
  protected static getFandsUrl = () => this.msFands
}
