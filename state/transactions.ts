import { proxy } from 'valtio';
import { deepEqual } from '../utils/object';
import transactionsData from "../content/transactions.json";
import state from '.';
import { showAlert } from "../state/actions/showAlert";

export type SelectOption = {
    value: string;
    label: string;
};

export interface TransactionState {
    selectedTransaction: SelectOption | null;
    selectedAccount: SelectOption | null;
    selectedDestAccount: SelectOption | null;
    txIsLoading: boolean;
    txIsDisabled: boolean;
    txFields: TxFields;
    viewType: 'json' | 'ui',
    editorSavedValue: null | string,
    editorValue?: string
}


export type TxFields = Omit<
    typeof transactionsData[0],
    "Account" | "Sequence" | "TransactionType"
>;

export type OtherFields = (keyof Omit<TxFields, "Destination">)[];

export const defaultTransaction: TransactionState = {
    selectedTransaction: null,
    selectedAccount: null,
    selectedDestAccount: null,
    txIsLoading: false,
    txIsDisabled: false,
    txFields: {},
    viewType: 'ui',
    editorSavedValue: null
};

export const transactionsState = proxy({
    transactions: [
        {
            header: "test1.json",
            state: defaultTransaction,
        },
    ],
    activeHeader: "test1.json"
});

/**
 * Simple transaction state changer
 * @param header Unique key and tab name for the transaction tab
 * @param partialTx partial transaction state, `undefined` deletes the transaction
 * 
 */
export const modifyTransaction = (
    header: string,
    partialTx?: Partial<TransactionState>,
    opts: { replaceState?: boolean } = {}
) => {
    const tx = transactionsState.transactions.find(tx => tx.header === header);

    if (partialTx === undefined) {
        transactionsState.transactions = transactionsState.transactions.filter(
            tx => tx.header !== header
        );
        return;
    }

    if (!tx) {
        const state = {
            ...defaultTransaction,
            ...partialTx,
        }
        transactionsState.transactions.push({
            header,
            state,
        });
        return state;
    }

    if (opts.replaceState) {
        const repTx: TransactionState = {
            ...defaultTransaction,
            ...partialTx,
        }
        tx.state = repTx
        return repTx
    }

    Object.keys(partialTx).forEach(k => {
        // Typescript mess here, but is definetly safe!
        const s = tx.state as any;
        const p = partialTx as any;
        if (!deepEqual(s[k], p[k])) s[k] = p[k];
    });

    return tx.state
};

// state to tx options
export const prepareTransaction = (data: any) => {
    let options = { ...data };

    // options.Destination = selectedDestAccount?.value;
    (Object.keys(options)).forEach(field => {
        let _value = options[field];
        // convert currency
        if (typeof _value === "object" && _value.type === "currency") {
            if (+_value.value) {
                options[field] = (+_value.value * 1000000 + "") as any;
            } else {
                options[field] = undefined; // 👇 💀
            }
        }
        // handle type: `json`
        if (typeof _value === "object" && _value.type === "json") {
            if (typeof _value.value === "object") {
                options[field] = _value.value as any;
            } else {
                try {
                    options[field] = JSON.parse(_value.value);
                } catch (error) {
                    const message = `Input error for json field '${field}': ${error instanceof Error ? error.message : ""
                        }`;
                    console.error(message)
                    options[field] = _value.value
                }
            }
        }

        // delete unneccesary fields
        if (!options[field]) {
            delete options[field];
        }
    });

    return options
}

// editor value to state
export const prepareState = (value?: string) => {
    const options = parseJSON(value);
    if (!options) {
        showAlert("Error!", {
            body: "Cannot save editor with malformed transaction."
        })
        return
    };

    const { Account, TransactionType, Destination, ...rest } = options;
    let tx: Partial<TransactionState> = {};

    if (Account) {
        const acc = state.accounts.find(acc => acc.address === Account);
        if (acc) {
            tx.selectedAccount = {
                label: acc.name,
                value: acc.address,
            };
        } else {
            tx.selectedAccount = {
                label: Account,
                value: Account,
            };
        }
    } else {
        tx.selectedAccount = null;
    }

    if (TransactionType) {
        tx.selectedTransaction = {
            label: TransactionType,
            value: TransactionType,
        };
    } else {
        tx.selectedTransaction = null;
    }

    if (Destination) {
        const dest = state.accounts.find(acc => acc.address === Destination);
        if (dest) {
            tx.selectedDestAccount = {
                label: dest.name,
                value: dest.address,
            };
        } else {
            tx.selectedDestAccount = {
                label: Destination,
                value: Destination,
            };
        }
    }

    Object.keys(rest).forEach(field => {
        const value = rest[field];
        console.log({ field, value });
        if (field === "Amount") {
            rest[field] = {
                type: "currency",
                value: +value / 1000000, // TODO handle object currencies
            };
        } else if (typeof value === "object") {
            rest[field] = {
                type: "json",
                value,
            };
        }
    });

    tx.txFields = rest;
    tx.editorSavedValue = null;

    return tx
}

export const parseJSON = (str?: string | null): any | undefined => {
    if (!str) return undefined
    try {
        const parsed = JSON.parse(str);
        return typeof parsed === "object" ? parsed : undefined;
    } catch (error) {
        return undefined;
    }
}

export { transactionsData }
