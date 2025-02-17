import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { config } from '@/config'
import { useWeb3Context } from '@/contexts/web3-context'
import { createContract, ErrorHandler } from '@/helpers'
import { ProposalState__factory } from '@/types/contracts'
import { ProposalsState } from '@/types/contracts/ProposalState'

export const useProposalState = (limit = 10) => {
  const { contractConnector } = useWeb3Context()
  const [lastProposalId, setLastProposalId] = useState<number | null>(null)
  const [proposals, setProposals] = useState<ProposalsState.ProposalInfoStructOutput[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams()

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) ?? 1)

  const location = useLocation()
  const navigate = useNavigate()

  const contract = useMemo(() => {
    if (!contractConnector) return null
    return createContract(config.PROPOSAL_STATE_CONTRACT, contractConnector, ProposalState__factory)
  }, [contractConnector])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const page = searchParams.get('page')
    if (page) {
      setCurrentPage(Number(page))
    }
  }, [location])

  // TODO: Use infinite load
  const fetchProposals = useCallback(async () => {
    if (!contract || lastProposalId === null) return
    setIsLoading(true)

    try {
      const startIndex = Math.max((currentPage - 1) * limit, 0)
      const endIndex = Math.min(startIndex + limit - 1, lastProposalId)

      if (startIndex > lastProposalId) {
        setProposals([])
        return
      }

      const ids = Array.from(
        { length: Math.max(endIndex - startIndex + 1, 0) },
        (_, i) => startIndex + i,
      )
      const proposalsData = await Promise.all(
        ids.map(id => contract.contractInstance.getProposalInfo(id)),
      )

      setProposals(proposalsData)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    } finally {
      setIsLoading(false)
    }
  }, [contract, lastProposalId, limit, currentPage])

  const changePage = (page: number) => {
    setCurrentPage(page)
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('page', String(page))
    navigate({ search: searchParams.toString() })
  }

  useEffect(() => {
    fetchProposals()
  }, [fetchProposals])

  useEffect(() => {
    if (!contract) return

    const fetchLastProposalId = async () => {
      try {
        const id = await contract.contractInstance.lastProposalId()
        const parsedId = Number(id)

        setLastProposalId(parsedId >= 0 ? parsedId : 0)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        setLastProposalId(0)
      }
    }

    fetchLastProposalId()
  }, [contract])

  return {
    proposals,
    isLoading,
    currentPage,
    changePage,
    lastProposalId,
  }
}
