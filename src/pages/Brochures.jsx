import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import BrochureList from '../components/common/BrochureList'
import { brochureAPI } from '../services/api'

export default function Brochures() {
  const { data, isLoading } = useQuery({
    queryKey: ['brochures'],
    queryFn: () => brochureAPI.getAll(),
  })

  const brochures = data?.data?.data?.brochures || []
  const count = data?.data?.data?.count || brochures.length

  return (
    <>
      <Helmet><title>Brochures | ProLink</title></Helmet>

      <div className="space-y-5 py-20 px-10">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Brochures</h1>
          <p className="text-sm text-slate-500">All submitted brochure files are listed here.</p>
        </div>

        <BrochureList brochures={brochures} count={count} isLoading={isLoading} variant="grid" />
      </div>
    </>
  )
}
