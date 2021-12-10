// 接口返回数据
interface demoModal {
  code: number;
  msg: string;
}

export interface questModal {
  <T>(data?: T): Promise<demoModal>
}