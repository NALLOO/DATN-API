export default class CustomResponse {
  code: number;

  success: boolean;

  message: string;

  data: any;

  constructor(
    data: any = null,
    success: boolean = true,
    message: string = 'success',
    code: number = 200,
  ) {
    this.code = code;
    this.success = success;
    this.message = message;
    this.data = data;
  }
}