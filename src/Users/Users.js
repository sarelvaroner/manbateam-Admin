import React, { useEffect, useState } from "react";
import firebase, { storage } from '../firebase'
import BootstrapTable from 'react-bootstrap-table-next';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import "react-toggle/style.css"
import Toggle from 'react-toggle'
import CheckSharpIcon from '@material-ui/icons/CheckSharp';
import ClearSharpIcon from '@material-ui/icons/ClearSharp';
import paginationFactory from 'react-bootstrap-table2-paginator';



const Users = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            const db = firebase.firestore();
            const rawData = await db.collection('users').get()
            const data = rawData.docs.map((doc) => doc.data())
            const dataWithImages = await Promise.all(data.map(async (user) => {
                const imageSrc = await storage.ref().child(`${user.avatarUrl}`).getDownloadURL()
                return { ...user, avatarUrl: imageSrc }
            }))
            setUsers(dataWithImages)
        }
        fetchUsers()
    }, [])


    const showProfileImage = (cell) => <Avatar src={cell} />


    const lookingToManagement = (cell) => cell ? <CheckSharpIcon /> : <ClearSharpIcon />



    const BlockingHandler = (cell, row) => {
        return (
            <Toggle
                defaultChecked={cell}
                aria-label='No label tag'
                onChange={(e) => {
                    const db = firebase.firestore();
                    db.collection("users").doc(row.uid).update({ isBlocked: e.target.checked })
                }}
            />
        )
    }


    const columns = [
        {
            dataField: 'firstName',
            text: 'שם',
            align: 'right',
            headerAlign: 'right'
        },
        {
            dataField: 'lastName',
            text: 'משפחה',
            align: 'right',
            headerAlign: 'right'
        },
        {
            dataField: 'avatarUrl',
            text: 'תמונה',
            formatter: showProfileImage,
            align: 'right',
            headerAlign: 'right'
        },
        {
            dataField: 'role',
            align: 'right',
            headerAlign: 'right',
            text: 'תפקיד'
        },
        {
            dataField: 'company',
            text: 'חברה',
            align: 'right',
            headerAlign: 'right'
        },
        {
            dataField: 'email',
            text: 'אימייל',
            align: 'right',
            headerAlign: 'right'
        },
        {
            dataField: 'phoneNumber',
            text: 'טלפון',
            align: 'right',
            headerAlign: 'right'
        },
        {
            dataField: 'isLookingForManagementJob',
            text: 'מחפש משרת ניהול',
            classes: 'iconContainer',
            align: 'center',
            headerAlign: 'right',
            formatter: lookingToManagement
        },
        {
            dataField: 'isBlocked',
            text: 'משתמש חסום',
            align: 'center',
            headerAlign: 'right',
            formatter: BlockingHandler
        }
    ];


    return (
        <>
            <Container fixed>
                <BootstrapTable
                    keyField='uid'
                    data={users}
                    columns={columns}
                    bordered={true}
                    bootstrap4={true}
                    pagination={paginationFactory({ sizePerPage: 8, onPageChange: (c, b) => { return false } })}
                />
            </Container>
        </>
    );
};


export default Users;







