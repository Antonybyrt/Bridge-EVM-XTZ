import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
import * as el from "@completium/event-listener";
export class Deposited implements att.ArchetypeType {
    constructor(public From: att.Address, public ethRecipient: string, public amount: att.Tez) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.From.to_mich(), att.string_to_mich(this.ethRecipient), this.amount.to_mich()]);
    }
    equals(v: Deposited): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): Deposited {
        return new Deposited(att.Address.from_mich((input as att.Mpair).args[0]), att.mich_to_string(((input as att.Mpair).args[1] as att.Mpair).args[0]), att.Tez.from_mich(((input as att.Mpair).args[1] as att.Mpair).args[1]));
    }
}
export class Withdrawn implements att.ArchetypeType {
    constructor(public To: att.Address, public amount: att.Tez) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.To.to_mich(), this.amount.to_mich()]);
    }
    equals(v: Withdrawn): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): Withdrawn {
        return new Withdrawn(att.Address.from_mich((input as att.Mpair).args[0]), att.Tez.from_mich((input as att.Mpair).args[1]));
    }
}
export class Bridged implements att.ArchetypeType {
    constructor(public To: att.Address, public amount: att.Tez) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.To.to_mich(), this.amount.to_mich()]);
    }
    equals(v: Bridged): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): Bridged {
        return new Bridged(att.Address.from_mich((input as att.Mpair).args[0]), att.Tez.from_mich((input as att.Mpair).args[1]));
    }
}
export const balances_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("address", []);
export const balances_value_mich_type: att.MichelineType = att.prim_annot_to_mich_type("mutez", []);
export type balances_container = Array<[
    att.Address,
    att.Tez
]>;
export const balances_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("big_map", att.prim_annot_to_mich_type("address", []), att.prim_annot_to_mich_type("mutez", []), []);
const deposit_arg_to_mich = (EthRecipient: string): att.Micheline => {
    return att.string_to_mich(EthRecipient);
}
const withdraw_arg_to_mich = (withdraw_amount: att.Tez): att.Micheline => {
    return withdraw_amount.to_mich();
}
const getBridged_arg_to_mich = (bridged_to: att.Address, bridged_amount: att.Tez): att.Micheline => {
    return att.pair_to_mich([
        bridged_to.to_mich(),
        bridged_amount.to_mich()
    ]);
}
const resetAmount_arg_to_mich = (reset_address: att.Address): att.Micheline => {
    return reset_address.to_mich();
}
export class Bridge {
    address: string | undefined;
    constructor(address: string | undefined = undefined) {
        this.address = address;
    }
    get_address(): att.Address {
        if (undefined != this.address) {
            return new att.Address(this.address);
        }
        throw new Error("Contract not initialised");
    }
    async get_balance(): Promise<att.Tez> {
        if (null != this.address) {
            return await ex.get_balance(new att.Address(this.address));
        }
        throw new Error("Contract not initialised");
    }
    async deploy(owner: att.Address, params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./contracts/bridge.arl", {
            owner: owner.to_mich()
        }, params)).address;
        this.address = address;
    }
    async deposit(EthRecipient: string, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "deposit", deposit_arg_to_mich(EthRecipient), params);
        }
        throw new Error("Contract not initialised");
    }
    async withdraw(withdraw_amount: att.Tez, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "withdraw", withdraw_arg_to_mich(withdraw_amount), params);
        }
        throw new Error("Contract not initialised");
    }
    async getBridged(bridged_to: att.Address, bridged_amount: att.Tez, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "getBridged", getBridged_arg_to_mich(bridged_to, bridged_amount), params);
        }
        throw new Error("Contract not initialised");
    }
    async resetAmount(reset_address: att.Address, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "resetAmount", resetAmount_arg_to_mich(reset_address), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_deposit_param(EthRecipient: string, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "deposit", deposit_arg_to_mich(EthRecipient), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_withdraw_param(withdraw_amount: att.Tez, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "withdraw", withdraw_arg_to_mich(withdraw_amount), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_getBridged_param(bridged_to: att.Address, bridged_amount: att.Tez, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "getBridged", getBridged_arg_to_mich(bridged_to, bridged_amount), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_resetAmount_param(reset_address: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "resetAmount", resetAmount_arg_to_mich(reset_address), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_owner(): Promise<att.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Address.from_mich((storage as att.Mpair).args[0]);
        }
        throw new Error("Contract not initialised");
    }
    async get_balances_value(key: att.Address): Promise<att.Tez | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(att.Int.from_mich((storage as att.Mpair).args[1]).toString()), key.to_mich(), balances_key_mich_type);
            if (data != undefined) {
                return att.Tez.from_mich(data);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_balances_value(key: att.Address): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(att.Int.from_mich((storage as att.Mpair).args[1]).toString()), key.to_mich(), balances_key_mich_type);
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    register_Deposited(ep: el.EventProcessor<Deposited>) {
        if (this.address != undefined) {
            el.registerEvent({ source: this.address, filter: tag => { return tag == "Deposited"; }, process: (raw: any, data: el.EventData | undefined) => {
                    const event = (x => {
                        return Deposited.from_mich((att.normalize(x) as att.Micheline));
                    })(raw);
                    ep(event, data);
                } });
            return;
        }
        throw new Error("Contract not initialised");
    }
    register_Withdrawn(ep: el.EventProcessor<Withdrawn>) {
        if (this.address != undefined) {
            el.registerEvent({ source: this.address, filter: tag => { return tag == "Withdrawn"; }, process: (raw: any, data: el.EventData | undefined) => {
                    const event = (x => {
                        return Withdrawn.from_mich((att.normalize(x) as att.Micheline));
                    })(raw);
                    ep(event, data);
                } });
            return;
        }
        throw new Error("Contract not initialised");
    }
    register_Bridged(ep: el.EventProcessor<Bridged>) {
        if (this.address != undefined) {
            el.registerEvent({ source: this.address, filter: tag => { return tag == "Bridged"; }, process: (raw: any, data: el.EventData | undefined) => {
                    const event = (x => {
                        return Bridged.from_mich((att.normalize(x) as att.Micheline));
                    })(raw);
                    ep(event, data);
                } });
            return;
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        rr1: att.string_to_mich("\"MUST_BE_REGISTERED_BEFORE\""),
        g1: att.string_to_mich("\"AMOUNT_MUST_BE_GREATER_THAN_0\""),
        w2: att.string_to_mich("\"UNSUFFISENT_LOCKED_FUNDS\""),
        w1: att.string_to_mich("\"AMOUNT_MUST_BE_GREATER_THAN_0\""),
        d1: att.string_to_mich("\"AMOUNT_MUST_BE_GREATER_THAN_0\"")
    };
}
export const bridge = new Bridge();
