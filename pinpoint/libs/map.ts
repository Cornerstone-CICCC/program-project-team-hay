import { MarkerData } from "@/app/(root)/track/[id]";

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export const calculateRegion = ({
                                    userLatitude,
                                    userLongitude,
                                    destinationLatitude,
                                    destinationLongitude,
                                }: {
    userLatitude: number | null;
    userLongitude: number | null;
    destinationLatitude?: number | null;
    destinationLongitude?: number | null;
}) => {
    if (!userLatitude || !userLongitude) {
        return {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }

    if (!destinationLatitude || !destinationLongitude) {
        return {
            latitude: userLatitude,
            longitude: userLongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }

    const minLat = Math.min(userLatitude, destinationLatitude);
    const maxLat = Math.max(userLatitude, destinationLatitude);
    const minLng = Math.min(userLongitude, destinationLongitude);
    const maxLng = Math.max(userLongitude, destinationLongitude);

    const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
    const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

    const latitude = (userLatitude + destinationLatitude) / 2;
    const longitude = (userLongitude + destinationLongitude) / 2;

    return {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
    };
};

export const generateMarkersFromData = 
({
    data,
    userLatitude,
    userLongitude,
}: {
    //NEED TO UPDATE 
    data: {
        id:string,
        name:string,
        image:string
    }[];
    userLatitude: number;
    userLongitude: number;
}): MarkerData[] => {
    return data.map((member) => {
        const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
        const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

        return {
            latitude: userLatitude + latOffset,
            longitude: userLongitude + lngOffset,
            name: member.name,
            userId: member.id,
            image:member.image
        };
    });
};
