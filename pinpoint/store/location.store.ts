import { create } from 'zustand';

export interface LocationStore {
    userLatitude: number | null;
    userLongitude: number | null;
    userAddress: string | null;
    setUserLocation: ({
                          latitude,
                          longitude,
                          address,
                      }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}

export const useLocationStore = create<LocationStore>((set)=>({
    userAddress: null,
    userLongitude: null,
    userLatitude: null,
    setUserLocation:({ latitude, longitude, address }:{latitude:number; longitude:number, address:string}) =>{
        set({
            userLatitude:latitude,
            userLongitude:longitude,
            userAddress:address
        })
    }

}))