import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Table, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


function App() {
  const [products, setproduct] = useState([]);
  const [addData, setaddData] = useState({
    name: "",
    price: "",
  });
  const [indexDelete, setindexDelete] = useState(-1)
  const [modalopen, setModalopen] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    price: ""
  })
  const [indexEdit, setIndexEdit] = useState(-1)
  const [modalEdit, setModalEdit] = useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(`http://localhost:9500/products`);
        setproduct(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);

  const renderData = () => {
    return products.map((val, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{val.name}</td>
          <td>{val.price}</td>
          <td>
            <button
              className="btn btn-danger mr-3"
              onClick={() => deleteDataModal(index)}
            >
              Delete
            </button>
            <button
              className="btn btn-secondary ml-5"
              onClick={() => editDataModal(index)}
            >
              Edit
            </button>
          </td>
        </tr>
      );
    });
  };

  const deleteData = async (id) => {
    try {
      let res = await axios.delete(`http://localhost:9500/products/${id}`);
      setproduct(res.data);
      setindexDelete(-1);
      setModalopen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDataModal = (index) => {
    setindexDelete(index);
    setModalopen(true);
  };

  const editDataModal = (index) => {
    setIndexEdit(index)
    setModalEdit(true)
  }

  const onInputChange = (e) => {
    setaddData({ ...addData, [e.target.name]: e.target.value });
  };

  const editHandler = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
    console.log(editData);
  };

  const addDataToBe = async () => {
    const dataToBe = addData;
    try {
      let res = await axios.post(`http://localhost:9500/products`, dataToBe);
      setproduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmEdit = async (id) => {
    const editDataCopy = editData
    console.log(editDataCopy)
    try {
      let res = await axios.patch(`http://localhost:9500/products/${id}`, editDataCopy)
      setproduct(res.data)
      setModalEdit(!modalEdit)
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {/* Modal Delete */}
      {indexDelete >= 0 ? (
        <Modal isOpen={modalopen} toggle={() => setModalopen(!modalopen)}>
          <ModalHeader>Delete data</ModalHeader>
          <ModalBody>
            Are you sure delete {products[indexDelete]?.name}
          </ModalBody>
          <ModalFooter>
            <button onClick={() => deleteData(products[indexDelete]?.id)}>
              Yes
            </button>
            <button onClick={() => setModalopen(!modalopen)}>No</button>
          </ModalFooter>
        </Modal>
      ) : null}

      {/* Modal Edit */}
      {indexEdit >= 0 ? (
        <Modal isOpen={modalEdit} toggle={editDataModal}>
          <ModalHeader>Delete data</ModalHeader>
          <ModalBody>
            <input style={{ marginBottom: "2%" }} placeholder="name" name="name" value={editData.name} onChange={editHandler} />
            <input placeholder="price" name="price" value={editData.price} onChange={editHandler} />
          </ModalBody>
          <ModalFooter>
            <button onClick={() => confirmEdit(products[indexEdit]?.id)}>Save</button>
            <button onClick={editDataModal}>Cancel</button>
          </ModalFooter>
        </Modal>
      ) : null}

      <center>
        <h1>Table Products</h1>
        <div className="mx-5">
          <Table striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>price</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>{renderData()}</tbody>
            <tfoot>
              <td></td>
              <td>
                <input
                  placeholder="product name"
                  className="form-control"
                  name="name"
                  value={addData.name}
                  onChange={onInputChange}
                />
              </td>
              <td>
                <input
                  placeholder="price"
                  className="form-control"
                  name="price"
                  value={addData.price}
                  onChange={onInputChange}
                />
              </td>
              <td>
                <button className="btn btn-success" onClick={addDataToBe}>
                  add data
                </button>
              </td>
            </tfoot>
          </Table>
        </div>
      </center>
    </div>
  );
}

export default App;
