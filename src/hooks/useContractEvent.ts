import { useQuery } from "react-query";
import { Contract, Filter, EventData } from "web3-eth-contract";
import { useContracts } from "../context/ContractsContext";
import { useAuthedWeb3 } from "../context/Web3Context";

export function usePastContractEvents<DataType = EventData[]>(
  contract: Contract,
  eventType: string | "allEvents",
  filter: Filter,
  eventsTransform?: (events: EventData[]) => DataType
) {
  return useQuery<DataType, [string, ...any[]]>(
    [
      "pastEvents",
      eventType,
      contract.options.address,
      filter,
      eventsTransform,
    ],
    async () => {
      let events = await contract.getPastEvents(eventType, {
        fromBlock: "earliest",
        filter,
      });

      if (eventsTransform) {
        return eventsTransform(events);
      } else {
        return (events as unknown) as DataType;
      }
    }
  );
}

export type TransactionEvent = EventData & { timeSent: string };

export function useTransactionHistoryEvents() {
  const { RariFundManager } = useContracts();

  const { web3, address } = useAuthedWeb3();

  return useQuery<TransactionEvent[], "transactionHistoryEvents">(
    "transactionHistoryEvents",
    async () => {
      const withdraws = await RariFundManager.getPastEvents("Withdrawal", {
        fromBlock: "earliest",
        filter: { payee: address },
      });

      const deposits = await RariFundManager.getPastEvents("Deposit", {
        fromBlock: "earliest",
        filter: { payee: address },
      });

      let merged_arrays = await Promise.all(
        withdraws.concat(deposits).map(async (event) => {
          const block = await web3.eth.getBlock(event.blockNumber);

          const date = new Date(parseInt(block.timestamp as string) * 1000);

          return {
            ...event,
            timeSent: date.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          } as TransactionEvent;
        })
      );

      // Sort descending by blockNumber
      merged_arrays.sort((a, b) => (a.blockNumber < b.blockNumber ? 1 : -1));

      return merged_arrays;
    }
  );
}
