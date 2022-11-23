import React, { useState } from "react";
// styles
import "./BorrowersPage.styles.scss";
// components
import CustomButton from "../../components/custom-button/CustomButton.component";
import FormInput from "../../components/form-input/FormInput.component";
import Table from "../../components/table/Table.component";
import Modal from "../../components/modal/Modal";
// redux
import { useDispatch, useSelector } from "react-redux";
import { createBorrower } from "../../redux/borrowers/borrowers.utils";
import { SelectBorrowers } from "../../redux/borrowers/index";
// validation
import { validateSsn } from "../../utils/utils";

const initialState = {
  ssn: "",
  bname: "",
  address: "",
  phone: "",
};

const BorrowersPage = () => {
  const dispatch = useDispatch();
  const borrowers = useSelector(SelectBorrowers);

  const [state, setState] = useState(initialState);
  const [modal, setModal] = useState(false);

  const { ssn, bname, address, phone } = state;

  const toggleModal = () => {
    setModal(!modal);
  };

  const onCancel = (e) => {
    toggleModal();
    setState({ ...initialState });
  };

  const onChange = (e) => {
    setState({ ...state, [e.currentTarget.name]: e.currentTarget.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateSsn(ssn))
      //dispatch(createBorrower({ ssn, bname, address, phone }));
      alert("Invalid SSN!!!");
    else alert("Valid SSN!!!");

    // close the modal pop up page
    toggleModal();
    // reset the state
    setState({ ...initialState });
  };

  const columns = [
    { heading: "Borrower ID", value: "card_id", key: 1 },
    { heading: "Ssn", value: "ssn", key: 2 },
    { heading: "Full Name", value: "bname", key: 3 },
    { heading: "Home Adress", value: "address", key: 4 },
    { heading: "Phone", value: "phone", key: 5 },
  ];

  return (
    <div className="borrowers-page">
      <div>
        <Modal toggleModal={toggleModal} modal={modal}>
          <form onSubmit={onSubmit}>
            <FormInput
              name="ssn"
              type="text"
              label="SSN"
              value={ssn}
              onChange={onChange}
              required
            />
            <FormInput
              name="bname"
              type="text"
              label="Full Name"
              value={bname}
              onChange={onChange}
              required
            />
            <FormInput
              name="address"
              type="text"
              label="Billing Address"
              value={address}
              onChange={onChange}
              required
            />
            <FormInput
              name="phone"
              type="text"
              label="Phone Number"
              value={phone}
              onChange={onChange}
            />
            <CustomButton>Submit</CustomButton>
          </form>
          <CustomButton onClick={onCancel}>CANCEL</CustomButton>
        </Modal>
      </div>
      <div>
        <Table data={borrowers} columns={columns} />
      </div>
    </div>
  );
};

export default BorrowersPage;