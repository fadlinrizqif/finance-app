'use client';

import { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Pencil, Trash } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";


type categories = {
  id: string,
  category: string
}


export default function Page() {

  const [showForm, setShowForm] = useState<boolean>(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [category, setCategory] = useState('');
  const [editId, setEditId] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleShowForm() {
    setShowForm((toggle) => !toggle)
    console.log(showForm);
  }

  async function showCategory() {
    setIsLoading(true)
    const raw = await fetch('/api/category');
    const data = await raw.json();
    console.log(data);
    setCategoriesData(data);
    setIsLoading(false)
  }

  useEffect(() => {
    showCategory()
  }, [])



  async function handleAddCategory() {
    if (!category) {
      return;
    }

    const res = await fetch('/api/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    });

    showCategory();
    setCategory('');
  }

  async function handleUpdateCategory(id: string) {
    const res = await fetch('/api/category', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, category: editCategory }),
    })
    setEditId('')
    setEditCategory('')
    showCategory();
  }


  async function handleDeleteCategory(id: string) {
    const res = await fetch('/api/category', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })

    showCategory();
  }


  return (
    <main className="h-full bg-gray-50 w-full  rounded p-2.5 m-2 overflow-auto">
      <div>
        <h1 className="text-3xl">Categroy Income</h1>
        <div className="py-3">
          <Button onClick={handleShowForm} >New Category</Button>

          {showForm &&
            <Card className="mt-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Input your category income"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}

                />
                <Button onClick={handleAddCategory}>
                  Create Category
                </Button>
              </div>
            </Card >
          }

        </div>
        <div className="p-2">
          <Card className="px-2">
            {isLoading ? (
              <Spinner />
            ) : (
              <Table>
                <TableCaption>A list of your categories.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">No.</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriesData.map((element: categories, index) => {
                    return (
                      <TableRow key={element.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        {editId === element.id ? (
                          <>
                            <TableCell>
                              <Input
                                value={editCategory}
                                onChange={(e) => { setEditCategory(e.target.value) }}
                              />
                            </TableCell>
                            <TableCell className="flex gap-2">
                              <Button onClick={() => handleUpdateCategory(editId)}>
                                Save
                              </Button>
                              <Button onClick={() => setEditId('')}>
                                Cancel
                              </Button>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>{element.category}</TableCell>
                            <TableCell className="flex gap-2">
                              <Button onClick={() => {
                                setEditId(element.id)
                                setEditCategory(element.category)
                              }}
                              >
                                <Pencil />
                              </Button>
                              <Button onClick={() => { handleDeleteCategory(element.id) }}>
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
    </main>
  );
}
