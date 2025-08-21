import { Request, Response } from 'express'
import sampleService from '../services/sampleService'
import { sampleDTO } from '../types/sampleType'

class SampleController {
  // post 메소드를 예시로 들겠습니다 
  postSample = async (req: Request, res: Response) => {
    /* 
      (선택) 유효성 검사를 실시합니다
    */
    const sampleDTO: sampleDTO = {
      /*
        여기에 service 함수로 넘길 바디를 정의하세요
        필요하다면 추가 파라미터를 정의해서 서비스 함수로 넘기면 됩니다.
        아래는 예시입니다.
      */
      id: 1,
      content: "sample"
    }
    const sample = await sampleService.createSample(sampleDTO) // service 함수 호출부 입니다.
    /*
      (선택) service함수에서 반환값을 가공하여 response를 돌려줍니다
    */
    res.status(201).json(sample)
  }
}

export default new SampleController() // default import로 객체처럼 사용하기 위해 인스턴스를 만들어 export 합니다.