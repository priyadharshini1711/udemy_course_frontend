import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { MDBTable, MDBTableBody, MDBRow, MDBCol, MDBContainer, MDBTableHead, MDBBtn, MDBBtnGroup, MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';

function App() {

  const [data, setData] = useState([]);

  const [searchValue, setSearchValue] = useState("");

  const [sortValue, setSortValue] = useState("")

  const [currentPage, setCurrentPage] = useState(0)

  const [totalPage] = useState(29)

  const [value, setValue] = useState("");

  const [operation, setOperation] = useState("");



  const sortOptions = ["id", "title", "duration", "time", "untis", "paid", "price", "user"]

  useEffect(() => {
    loadData(0, 50, 0);
  }, [])

  const loadData = async (start, end, increase, type = null, value) => {
    switch (type) {
      case "search":
        setOperation(type)
        console.log("search value", searchValue)
        return await axios.get(`http://localhost:8000/courses?q=${searchValue}&_start=${start}&_end=${end}`).then((response) => {
          setData(response.data)
          setCurrentPage(currentPage + increase)

        }).catch((err) => console.log(err))

      case "sort":
        setOperation(type)
        console.log("sample sort", value)
        setValue(value)
        return await axios.get(`http://localhost:8000/courses?_sort=${value}&_order=asc&_start=${start}&_end=${end}`).then((response) => {
          setData(response.data)
          setCurrentPage(currentPage + increase)
        }).catch((err) => console.log(err))

      case "filter":
        setOperation(type)
        setValue(value)
        return await axios.get(`http://localhost:8000/courses?paid=${value}&_start=${start}&_end=${end}`).then((response) => {
          setData(response.data)
          setCurrentPage(currentPage + increase)
        }).catch((err) => console.log(err))


      default:
        setOperation(type)
        return await axios.get(`http://localhost:8000/courses?_start=${start}&_end=${end}`).then((response) => {
          setData(response.data)
          setCurrentPage(currentPage + increase)
        }
        ).catch((err) => console.log(err))

    }

  }

  const handleReset = () => {
    setOperation("")
    setSearchValue("")
    setSortValue("")
    loadData(0, 50, 0);
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    loadData(0, 50, 0, "search",)
  }

  const handleSort = async (val) => {
    setSortValue(val)
    loadData(0, 50, 0, "sort", val)
    console.log("from handlesort", val)
  }

  const handleFilter = async (value) => {
    setSortValue(value)
    loadData(0, 50, 0, "filter", value)
  }

  const renderPagination = () => {
    if (data.length < 50 && currentPage === 0)
      return null
    if (currentPage === 0) {
      return (
        <MDBPagination className='mb-0'>
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadData(50, 100, 1, operation, value)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>

      )
    } else if (currentPage < totalPage - 1 && data.length === 50) {
      return (
        <MDBPagination className='mb-0'>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadData((currentPage - 1) * 50, currentPage * 50, -1, operation, value)}>Previous</MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadData((currentPage + 1) * 50, (currentPage + 2) * 50, 1, operation, value)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      )
    } else {
      return (
        <MDBPagination className='mb-0'>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadData((currentPage - 1) * 50, currentPage * 50, -1, operation, value)}>Previous</MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>)
    }
  }

  console.log("data", data)
  return (
    <MDBContainer>
      <form style={{
        margin: "auto",
        padding: "15px",
        maxWidth: "400px",
        alignContent: "center"
      }}
        className="d-flex input-group w-auto"
        onSubmit={handleSearch}
      >
        <input type="text" className='form-control' placeholder='Search Title' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />

        <MDBBtn type='submit' color='dark' className='mx-2'>Search</MDBBtn>
        <MDBBtn className='mx-2' color='info' onClick={() => handleReset()}>Reset</MDBBtn>

      </form>
      <div className='container'>
        <h2 className='text-center'>Udemy Course List</h2>
        <MDBRow>
          <MDBCol>
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope='col'> Id </th>
                  <th scope='col'> Course Id </th>
                  <th scope='col'> Title </th>
                  <th scope='col'> Duration </th>
                  <th scope='col'> Time </th>
                  <th scope='col'> Units </th>
                  <th scope='col'> Paid </th>
                  <th scope='col'> Price </th>
                  <th scope='col'> User </th>
                </tr>
              </MDBTableHead>
              {data.length === 0 ? (
                <MDBTableBody className="align-center mb-0">
                  <tr>
                    <td colSpan={8} className="text-center mb-0"> No Data Found</td>
                  </tr>
                </MDBTableBody>
              ) : (
                data.map((item, index) => {
                  return (<MDBTableBody key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.id}</td>
                      <td>{item.title}</td>
                      <td>{item.duration}</td>
                      <td>{item.time}</td>
                      <td>{item.units}</td>
                      <td>{item.paid}</td>
                      <td>{item.price}</td>
                      <td>{item.user}</td>
                    </tr>
                  </MDBTableBody>)
                })
              )}
            </MDBTable>

          </MDBCol>
        </MDBRow>

      </div>
      <div style={{
        margin: "auto",
        padding: "15px",
        maxWidth: "250px",
        alignContent: "center"
      }}>{renderPagination()}</div>

      <MDBRow>
        <MDBCol size={8}>
          <h5>Sort By:</h5>
          <select style={{ width: "50%", borderRadius: "2px", height: "35px" }} onChange={(e) => handleSort(e.target.value)} value={sortValue}>
            <option>Please Select Value</option>
            {sortOptions.map((item, index) => {
              return (
                <option value={item} key={index}>{item}</option>
              )
            })}

          </select>

        </MDBCol>
        <MDBCol size={4}>
          <h5>Filter By Price</h5>
          <MDBBtnGroup>
            <MDBBtn color='success' onClick={() => handleFilter("false")} >
              Free
            </MDBBtn>
            <MDBBtn color='danger' onClick={() => handleFilter("true")} style={{ marginLeft: "2px" }}>
              Paid
            </MDBBtn>
          </MDBBtnGroup>

        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
