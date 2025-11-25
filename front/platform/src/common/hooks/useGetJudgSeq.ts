import { useParams } from 'react-router-dom'

interface Params {
  judgSeq: number
}

const useGetJudgSeq = () => {
  const { judgSeq } = useParams() as unknown as Readonly<Params>

  return judgSeq
}

export default useGetJudgSeq
