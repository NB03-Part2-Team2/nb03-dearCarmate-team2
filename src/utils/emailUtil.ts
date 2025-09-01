import 'dotenv/config';
import nodemailer from 'nodemailer';
import { CustomError } from './customErrorUtil';

export class EmailUtil {
  private static transporter: nodemailer.Transporter;

  /**
   * 이메일 전송기를 초기화합니다.
   *
   * 587 포트가 대부분의 네트워크에서 허용되며 호환성이 좋음.
   */
  static initializeTransporter = () => {
    console.log('EmailUtil 초기화:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '설정됨' : '설정안됨');

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  };

  /**
   * 계약서 등록 알림 이메일을 생성합니다.
   */
  static createContractDocumentEmail = (
    customerEmail: string,
    customerName: string,
    fileNames: string[],
    contractId: number,
  ) => {
    const subject = '[DearCarMate] 계약서가 등록되었습니다';
    const fileListHtml = fileNames.map((fileName) => `<li>${fileName}</li>`).join('');
    const html = `
      <h1>계약서 등록 알림</h1>
      <p>안녕하세요, ${customerName}님</p>
      <p>계약서가 등록되었습니다.</p>
      <p>등록된 파일:</p>
      <ul>${fileListHtml}</ul>
      <p>계약번호: ${contractId}</p>
      <p>등록시간: ${new Date().toLocaleString('ko-KR')}</p>
    `;

    return {
      to: customerEmail,
      subject,
      html,
    };
  };

  /**
   * 이메일을 발송합니다.
   */
  static sendEmail = async (emailData: any): Promise<void> => {
    try {
      if (!this.transporter) {
        this.initializeTransporter();
      }

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('이메일 발송 실패:', error);
      throw new CustomError('이메일 발송 중 오류가 발생했습니다.', 500);
    }
  };
}
