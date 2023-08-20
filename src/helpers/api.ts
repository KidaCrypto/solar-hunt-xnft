import axios from '../services/axios';
import { OnchainNFTDetails, ReadApiAsset } from './onchain';

export type BaseParams = {
    account: string; // email or public key
    isPublicKey: boolean;
}

export type ApiResult<T> = {
    success: boolean;
    message?: string;
    data?: T;
}

export type Hunt = {
    id: number;
    address: string;
    monster_id: number;
    caught: boolean;
    gold: number;
    exp: number;
    is_shiny: boolean;
    created_at: string;

    monster: Monster;
    hunt_loots: HuntLoot[];
}

export type Monster = {
    id: number;
    name: string;
    img_file: string;
    shiny_img_file: string;
    shiny_chance: number;
    base_gold: number;
    max_gold: number;
    base_exp: number;
    max_exp: number;
    catch_rate: number;
    shiny_catch_rate: number;
}

export type MonsterLoot = {
    id: number;
    name: string;
    img_file: string;
    monster_id: number;
    loot_chance: number;
}

export type HuntLoot = {
    hunt_id: number;
    loot_id: number;
    loot?: MonsterLoot[];
}

export type HuntResult = "Failed to catch" | "Caught";


export type CraftableSkill = {
    id: number;
    craftable_id: number;
    name: string;
    value: number;
  }
  
  export type CraftableRequirement = {
    id: number;
    craftable_id: number;
    loot_id: number;
    value: number;
    loot?: MonsterLoot[];
  }

export type CraftableRequirementByName = {
    craftable_id: number;
    name: string;
    img_file: string;
    value: number;
}
  
export type Craftable = {
    id: number;
    name: string;
    img_file: string;
    skills?: CraftableSkill[];
    requirements?: CraftableRequirementByName[];
}

export type AccountMigration = {
    id: number;
    account: string;
    migration_link: string;
}

export const newHunt = async(params: BaseParams) => {
    try {
        let res = await axios.post<ApiResult<HuntResult>>('/hunt', params);

        if(!res.data.success) {
            return "Error";
        }

        if(!res.data.data) {
            return "Error";
        }

        return res.data.data;
    }

    catch (e: any){
        return "Error: " + e.response.message;
    }
}

export const getHuntHistory = async(params: BaseParams) => {
    try {
        let res = await axios.post<ApiResult<Hunt[]>>('/hunt/history', params);

        if(!res.data.success) {
            return "Error";
        }

        if(!res.data.data) {
            return "Error";
        }

        return res.data.data;
    }

    catch (e: any){
        return "Error: " + e.response;
    }
}

// maybe get from wallet's rpc
export const getAddressTokens = async(params: BaseParams) => {
    try {
        let res = await axios.post<ApiResult<{ gold: number; exp: number ;}>>('/onchain/tokens', params);

        if(!res.data.success) {
            return "Error";
        }

        if(!res.data.data) {
            return "Error";
        }

        return res.data.data;
    }

    catch (e: any){
        return "Error: " + e.response;
    }
}

// maybe get from wallet's rpc
export const getAddressNfts = async(params: BaseParams) => {
    try {
        // key = "monster" | "loot" | "craftable"
        let res = await axios.post<ApiResult<{ [key: string]: OnchainNFTDetails[] }>>('/onchain/nfts', params);

        if(!res.data.success) {
            return "Error";
        }

        if(!res.data.data) {
            return "Error";
        }

        return res.data.data;
    }

    catch (e: any){
        return "Error: " + e.response;
    }
}

// maybe get from wallet's rpc
export const getCraftables = async() => {
    try {
        let res = await axios.get<Craftable[]>('/craftable');
        return res.data;
    }

    catch (e: any){
        return "Error: " + e.response;
    }
}
// maybe get from wallet's rpc
export const getAddressMigrationLinks = async(params: BaseParams) => {
    try {
        // key = "monster" | "loot" | "craftable"
        let res = await axios.post<ApiResult<AccountMigration[]>>('/accountMigration/find', params);

        if(!res.data.success) {
            return "Error";
        }

        if(!res.data.data) {
            return "Error";
        }

        return res.data.data;
    }

    catch (e: any){
        return "Error: " + e.response;
    }
}

export const getPublicKeyForNonPublicKeyAccount = async(account: string) => {
    try {
        let res = await axios.post<ApiResult<string>>('/onchain/publicKey', { account });
        return res.data.data;
    }

    catch (e: any){
        return null;
    }
}