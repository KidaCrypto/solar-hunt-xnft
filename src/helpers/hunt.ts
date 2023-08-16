import axios from '../services/axios';

export type BaseHuntParams = {
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

export const newHunt = async(params: BaseHuntParams) => {
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

export const getHuntHistory = async(params: BaseHuntParams) => {
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
        return "Error: " + e.response.message;
    }

}