"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";

export default function TableDemo() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [inputEmailValue, setInputEmailValue] = useState(search || "");
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [employee, setEmployee] = useState<any>([]);
  const [inputValue, setInputValue] = useState({
    id: Math.random() + 1,
    employeeName: "",
    dateOfBirth: "",
    image: "",
    email: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, [search]);

  const fetchEmployees = () => {
    axios
      .get(`http://localhost:3000/api/employees?email_like=${search}`)
      .then((res: any) => setEmployee(res.data.employees))
      .catch((err) => console.log(err));
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`http://localhost:3000/api/employees/${id}`)
      .then(() => {
        fetchEmployees();
      })
      .catch((err) => console.log(err));
  };
  const handleUpdate = (employee: any) => {
    setInputValue({
      id: employee.id,
      employeeName: employee.employeeName,
      dateOfBirth: employee.dateOfBirth,
      image: employee.image,
      email: employee.email,
    });

    setIsEditing(true);
    setEditingEmployeeId(employee.id);
  };

  const handleSaveUpdate = () => {
    axios
      .put(
        `http://localhost:3000/api/employees/${editingEmployeeId}`,
        inputValue
      )
      .then(() => {
        fetchEmployees();
        setInputValue({
          id: Math.random() + 1,
          employeeName: "",
          dateOfBirth: "",
          image: "",
          email: "",
        });
        setIsEditing(false);
        setEditingEmployeeId(null);
      })
      .catch((err) => console.log(err));
  };

  const handleAdd = () => {
    axios
      .post(`http://localhost:3000/api/employees`, inputValue)
      .then(() => {
        fetchEmployees();
        setInputValue({
          id: Math.random() + 1,
          employeeName: "",
          dateOfBirth: "",
          image: "",
          email: "",
        });
      })
      .catch((err) => console.log(err));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({
      ...inputValue,
      [event.target.id]: event.target.value,
    });
  };
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmailValue(event.target.value);
    setSearch(event.target.value);
    route.push(`/?search=${event.target.value}`);
  };

  return (
    <div className="flex">
      <Table>
        <TableCaption>
          <input
            type="text"
            placeholder="tìm kiếm theo email"
            value={inputEmailValue}
            onChange={handleChangeName}
          />
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Tên nhân viên</TableHead>
            <TableHead>Ngày sinh</TableHead>
            <TableHead>Hình ảnh</TableHead>
            <TableHead>Email </TableHead>
            <TableHead>Chức năng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employee.map((item: any, index: number) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.employeeName}</TableCell>
              <TableCell>{item.dateOfBirth}</TableCell>
              <TableCell>
                <img src={item.image} className="h-[90px]" />
              </TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>
                <button
                  className="bg-red-500 rounded-lg mr-2"
                  onClick={() => handleDelete(item.id)}
                >
                  Xóa
                </button>
                <button
                  onClick={() => handleUpdate(item)}
                  className="bg-green-600 rounded-lg"
                >
                  Sửa
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Card className="w-[350px]">
        <CardTitle>
          {isEditing ? "Cập nhật nhân viên" : "Thêm mới nhân viên"}
        </CardTitle>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="employeeName">Tên nhân viên</Label>
              <Input
                id="employeeName"
                value={inputValue.employeeName}
                onChange={handleInputChange}
              />
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input
                id="dateOfBirth"
                value={inputValue.dateOfBirth}
                onChange={handleInputChange}
                placeholder="mm/dd/yyyy"
              />
              <Label htmlFor="image">Hình ảnh</Label>
              <Input
                type="text"
                id="image"
                value={inputValue.image}
                onChange={handleInputChange}
              />
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={inputValue.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleSaveUpdate}>
                Lưu
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
            </div>
          ) : (
            <Button variant="primary" onClick={handleAdd}>
              Thêm
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
