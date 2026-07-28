import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
} from "@mui/material";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import { getDashboardStats } from "../services/api";

export default function AnalyticsDashboard() {

    const [data,setData] = useState<any>(null);

    useEffect(()=>{
        load();
    },[]);

    async function load(){
        const res = await getDashboardStats();
        setData(res);
    }

    if(!data)
        return <CircularProgress/>;

    return(

        <Card
        sx={{
            mt:3,
            bgcolor:"#1E293B",
            borderRadius:4
        }}
        >

            <CardContent>

                <Typography
                variant="h5"
                color="white"
                mb={4}
                >
                    📊 Analytics Dashboard
                </Typography>

                <Grid container spacing={4}>

                    <Grid size={{xs:12,md:6}}>

                        <Typography color="white" mb={2}>
                            Pages per Document
                        </Typography>

                        <ResponsiveContainer width="100%" height={300}>

                            <BarChart data={data.document_data}>

                                <CartesianGrid strokeDasharray="3 3"/>

                                <XAxis dataKey="filename"/>

                                <YAxis/>

                                <Tooltip/>

                                <Bar
                                dataKey="pages"
                                fill="#3B82F6"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </Grid>

                    <Grid size={{xs:12,md:6}}>

                        <Typography color="white" mb={2}>
                            Chunks per Document
                        </Typography>

                        <ResponsiveContainer width="100%" height={300}>

                            <BarChart data={data.document_data}>

                                <CartesianGrid strokeDasharray="3 3"/>

                                <XAxis dataKey="filename"/>

                                <YAxis/>

                                <Tooltip/>

                                <Bar
                                dataKey="chunks"
                                fill="#10B981"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

}