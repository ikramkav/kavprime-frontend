// src/hooks/useTicketFiltering.ts
import { useMemo } from "react";
import { Ticket } from "@/redux/services/tickets/ticketsApi";

interface UseTicketFilteringProps {
  tickets: Ticket[];
  statusFilter: string;
  typeFilter: string;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
}

interface UseTicketFilteringReturn {
  filteredTickets: Ticket[];
  paginatedTickets: Ticket[];
  totalPages: number;
  ticketTypes: string[];
  statuses: string[];
}

export const useTicketFiltering = ({
  tickets,
  statusFilter,
  typeFilter,
  searchQuery,
  currentPage,
  itemsPerPage,
}: UseTicketFilteringProps): UseTicketFilteringReturn => {
  // Get unique ticket types
  const ticketTypes = useMemo(() => {
    const types = new Set(tickets.map((t) => t.ticket_type));
    return Array.from(types).sort();
  }, [tickets]);

  // Get unique statuses
  const statuses = useMemo(() => {
    const stats = new Set(tickets.map((t) => t.status));
    return Array.from(stats).sort();
  }, [tickets]);

  // Filter tickets based on all criteria
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter;
      const matchesType = typeFilter === "ALL" || ticket.ticket_type === typeFilter;
      const matchesSearch =
        searchQuery === "" ||
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toString().includes(searchQuery);

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [tickets, statusFilter, typeFilter, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  // Get paginated tickets
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTickets, currentPage, itemsPerPage]);

  return {
    filteredTickets,
    paginatedTickets,
    totalPages,
    ticketTypes,
    statuses,
  };
};