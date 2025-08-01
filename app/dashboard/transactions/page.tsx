'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";



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

export default function Page() {

  const [showForm, setShowForm] = useState<boolean>(false);
  const [transactionsData, setTransactionsData] = useState([]);
  const [nameTransc, setNameTransc] = useState('');
  const [nominalTransc, setNominalTransc] = useState('');
  const [editNameTransc, setEditNameTransc] = useState('');
  const [editNominalTransc, setEditNominalTransc] = useState('');
  const [category, setCategory] = useState('');
  const [categoriesData, setCategoriesData] = useState([]);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  function handleShowForm() {
    setShowForm((toggle) => !toggle)
    console.log(showForm);
  }



  async function showCategory() {
    const raw = await fetch('/api/category');
    const data = await raw.json();
    console.log(data);
    setCategoriesData(data);
  }

  async function showTransaction() {
    setIsLoading(true)
    const raw = await fetch('/api/transactions');
    const data = await raw.json();
    console.log(data);
    setTransactionsData(data);
    setIsLoading(false)
  }

  useEffect(() => {
    showCategory()
    showTransaction()
  }, [])

  async function handleAddTransactions() {
    if (!nameTransc || !nominalTransc || !category) {
      return;
    }

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categoryId: category,
        name: nameTransc,
        nominal: nominalTransc
      }),
    });


    console.log(nameTransc);
    console.log(nominalTransc);
    console.log(category);

    setCategory('');
    setNameTransc('');
    setNominalTransc('');
    showTransaction();
  }


  async function handleUpdateTransactions(id: string) {
    const res = await fetch('/api/transactions', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        name: editNameTransc,
        nominal: Number(editNominalTransc)
      }),
    })
    setEditId('')
    setEditNameTransc('')
    setEditNominalTransc('')
    showTransaction();
  }

  async function handleDeleteTransactions(id: string) {
    const res = await fetch('/api/transactions', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })

    showTransaction();
  }

  return (
    <main className="h-full bg-gray-50 w-full rounded p-2.5 m-2 overflow-auto">
      <div>
        <h1 className="text-3xl">Transactions</h1>
        <div className="py-3">
          <Button className="pt-2 -mb-2" onClick={handleShowForm} >New Transaction</Button>

          {showForm &&
            <Card className="px-2">
              <div className="flex flex-col gap-2">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesData.map((element: categories, index) => {
                      return (
                        <SelectItem key={element.id} value={element.id}>{element.category}</SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Input your name transaction"
                  value={nameTransc}
                  onChange={(e) => setNameTransc(e.target.value)}
                />
                <Input
                  placeholder="Input your nominal value"
                  value={nominalTransc}
                  onChange={(e) => setNominalTransc(e.target.value)}
                />
                <Button onClick={handleAddTransactions}>
                  Create Transaction
                </Button>
              </div>
            </Card>
          }

        </div>
        <div>
          <Card className="px-2">
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
                        {editId === element.id ? (
                          <>
                            <TableCell>
                              {element.category.category}
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editNameTransc}
                                onChange={(e) => { setEditNameTransc(e.target.value) }}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editNominalTransc}
                                onChange={(e) => { setEditNominalTransc(e.target.value) }}
                              />
                            </TableCell>
                            <TableCell>
                              {formatDate(element.updatedAt)}
                            </TableCell>
                            <TableCell className="flex gap-2">
                              <Button onClick={() => { handleUpdateTransactions(element.id) }}>
                                Save
                              </Button>
                              <Button onClick={() => setEditId('')}>
                                Cancel
                              </Button>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>{element.category.category}</TableCell>
                            <TableCell>{element.name}</TableCell>
                            <TableCell>{`Rp. ${element.nominal.toLocaleString()}`}</TableCell>
                            <TableCell>{formatDate(element.updatedAt)}</TableCell>
                            <TableCell className="flex gap-2">
                              <Button onClick={() => {
                                setEditId(element.id)
                                setEditNameTransc(element.name)
                                setEditNominalTransc(element.nominal)
                              }}
                              >
                                <Pencil />
                              </Button>
                              <Button onClick={() => { handleDeleteTransactions(element.id) }}>
                                <Trash />
                              </Button>
                            </TableCell>
                          </>
                        )}

                      </TableRow>
                    )
                  }
                  )
                  }
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </div>
    </main >
  );
}
