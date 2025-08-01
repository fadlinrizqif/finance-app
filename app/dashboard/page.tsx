'use client';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";




type transactions = {
  id: string,
  name: string,
  nominal: string,
  updatedAt: string,
  category: categories
}

type categories = {
  id: string,
  category: string,
}


export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [totalNominal, setTotalNominal] = useState<number>(0);
  const [transactionsData, setTransactionsData] = useState([]);
  const [showData, setShowData] = useState([]);

  async function showTotalNominal() {
    setIsLoading(true)
    const raw = await fetch('/api/dashboard');
    const data = await raw.json();
    setTotalNominal(data.total)
    console.log("Ini pas inisialisasi", data)

    setIsLoading(false)
  }

  async function showMonthlyData() {
    setIsLoading(true)
    const raw = await fetch('/api/dashboard/chart');
    const data = await raw.json();
    setShowData(data)
    console.log("Ini data untuk Bulanan", data)

    setIsLoading(false)
  }


  async function showTransaction() {
    setIsLoading(true)
    const raw = await fetch('/api/transactions');
    const data = await raw.json();
    setTransactionsData(data);
    setIsLoading(false)
  }

  useEffect(() => {
    showTotalNominal();
    showTransaction();
    showMonthlyData();
  }, [])

  const chartConfig = {
    total: {
      label: "Total",
      color: "#2563eb",
    },
  } satisfies ChartConfig


  return (
    <main className="h-full bg-gray-50 w-full  rounded p-2.5 m-2 overflow-auto">
      <div>
        <h1 className="text-3xl">Dashboard</h1>
        <div className="flex gap-2 mt-2">
          <Card className="w-[50%]">
            <CardHeader>
              <CardTitle>Total Nominal</CardTitle>
            </CardHeader>
            <CardContent>
              <h3>{isLoading ? "Loading" : `Rp. ${totalNominal.toLocaleString()}`}</h3>
            </CardContent>

          </Card>


          {isLoading ? (
            <Spinner />
          ) : (
            <Card className="w-[50%]">
              <CardHeader>
                <CardTitle>Outcome each Month</CardTitle>
                <CardDescription>January - August 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart accessibilityLayer data={showData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="total" fill={chartConfig.total.color} radius={8} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

        </div>
        <div className="mt-2">
          <Card>
            {isLoading ? (
              <Spinner />
            ) : (
              <Table>
                <TableCaption>A list of your recent transactions.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">No.</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Name Transaction</TableHead>
                    <TableHead>Nominal</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsData.map((element: transactions, index) => {
                    return (
                      <TableRow key={element.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{element.category.category}</TableCell>
                        <TableCell>{element.name}</TableCell>
                        <TableCell>{`Rp. ${element.nominal.toLocaleString()}`}</TableCell>
                        <TableCell>{formatDate(element.updatedAt)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}

          </Card>
        </div>

      </div>
    </main >
  );
}


