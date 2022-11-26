import React, { useState, useEffect } from "react";
// components
import { Table, Tag, message, Input } from "antd";
import CustomButton from "../../components/custom-button/CustomButton.component";
// redux
import { useDispatch, useSelector } from "react-redux";
import { SelectBorrowersWithKeys } from "../../redux/borrowers";
import { SelectFines, filter as FilterFines } from "../../redux/fines";
import { SelectLoans } from "../../redux/loans";
import {
  getFines,
  refreshFines,
  updateFines,
  updateFine,
} from "../../redux/fines/fines.utils";

// validation methods
import { validatePayment, validatMultiplePayments } from "../../utils/utils";

const FinesPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFines());
  }, [dispatch]);

  const fines = useSelector(SelectFines);
  const loans = useSelector(SelectLoans);
  const borrowers = useSelector(SelectBorrowersWithKeys);

  const [filtered, setFiltered] = useState(false);
  const [enteredAmount, setEnteredAmount] = useState(0);
  // EDITING KEY DOES NOT WORK.
  //const [editingKey, setEditingKey] = useState(0);
  const [clickedFullPay, setclickedFullPay] = useState(false);
  const [clickedSinglePay, setclickedSingePay] = useState(false);

  let index = 0;
  const outerTableData = borrowers.map((current_borrower) => {
    // FIND THE LOANS ASSOCIATED WITH THE CURRENT BORROWER USING FILTER
    const borrower_loans = loans.filter(
      (loan) => loan.card_id === current_borrower.card_id
    );
    let borrower_fines = [];
    // USING THE LOANS, FIND EACH OF THE FINES ASSOCIATED WITH A SINGLE LOAN
    borrower_loans.forEach((current_loan) => {
      const fine = fines.find((fine) => fine.loan_id === current_loan.loan_id);
      if (fine) {
        borrower_fines.push({ ...fine, key: index + 1 });
        // UPDATE THE INDEX KEY
        index = index + 1;
      }
    });

    let total_fine_amount = 0;

    if (borrower_fines.length) {
      total_fine_amount = borrower_fines.reduce(
        (accumulator, { fine_amount }) => accumulator + fine_amount,
        0
      );
    }

    return { ...current_borrower, borrower_fines, total_fine_amount };
  });

  const startSinglePayment = async (fine) => {
    //setEditingKey(fine.key);
    if (await validatePayment(fine.loan_id)) {
      setclickedSingePay(true);
    } else {
      errorSingleFine(fine.loan_id);
    }
  };

  const processSinglePayment = (fine) => {
    const { loan_id, fine_amount, paid } = fine;
    const balance_left = fine_amount - enteredAmount;
    dispatch(
      updateFine({
        loan_id: loan_id,
        fine: { loan_id: loan_id, fine_amount: balance_left, paid: paid },
      })
    );
    setclickedSingePay(false);
    successSingleFine(balance_left);
    setEnteredAmount(0);
  };

  const startBatchPayment = async ({ card_id, borrower_fines }) => {
    const loan_ids = borrower_fines.map((fine) => {
      return fine.loan_id;
    });
    if (await validatMultiplePayments(loan_ids)) {
      setclickedFullPay(true);
    } else {
      errorMultipleFines(card_id);
    }
  };

  // TODO FINISH THIS FUNC
  const processBatchPayment = ({ borrower_fines }) => {
    const fines_to_be_updated = borrower_fines
      .filter((fine) => fine.paid !== true)
      .map((fine) => {
        return fine.loan_id;
      });

    dispatch(updateFines(fines_to_be_updated));
    setclickedFullPay(false);
    successMultipleFines();
    setEnteredAmount(0);
  };

  const handleTableRefresh = () => {
    dispatch(refreshFines());
  };

  const handleFiltering = () => {
    dispatch(FilterFines());
    setFiltered(true);
  };

  const handleReset = () => {
    dispatch(getFines());
    setFiltered(false);
  };

  const onChange = (e) => {
    setEnteredAmount(e.currentTarget.value);
  };

  // TO ALLOW ONLY ONE TABLE TO BE EDITED AT ANY TIME - DOESN'T WORK
  // const isEditing = (key) => {
  //   return key === editingKey;
  // };

  const successSingleFine = (balance_left) =>
    message.info("Action in progress...", 2, () =>
      message.success(
        `Success: Payment went through!! Remaining Balance: $${balance_left}!!`,
        3
      )
    );

  const errorSingleFine = (loan_id) => {
    message.info("Action in progress...", 2, () =>
      message.error(
        `Error: Payment not allowed... Book with loan ID ${loan_id} has been returned yet.`,
        3
      )
    );
  };

  const successMultipleFines = () =>
    message.info("Action in progress...", 2, () =>
      message.success(
        `Success: Payment went through!! Remaining Balance: $0!!`,
        3
      )
    );

  const errorMultipleFines = (card_id) => {
    message.info("Action in progress...", 2, () =>
      message.error(
        `Error: Payment not allowed... One or more books associated with Borrower ID ${card_id} has been returned yet.`,
        3
      )
    );
  };

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "Loan ID",
        dataIndex: "loan_id",
        key: 1,
        align: "center",
      },
      {
        title: "Fine Amount",
        dataIndex: "fine_amount",
        key: 2,
        align: "center",
        render: (_, { fine_amount }) => <span>${fine_amount}</span>,
      },
      {
        title: "Status",
        dataIndex: "paid",
        key: 3,
        align: "center",
        render: (_, record) =>
          record.paid ? (
            <Tag color="green">PAID</Tag>
          ) : (
            <Tag color="volcano">NOT PAID</Tag>
          ),
      },
      {
        title: "Action",
        dataIndex: "action",
        key: 4,
        align: "center",
        width: !clickedSinglePay ? 150 : 200,
        render: (_, record) =>
          record.fine_amount ? (
            !clickedSinglePay ? (
              <CustomButton onClick={() => startSinglePayment(record)} small>
                Pay Fine
              </CustomButton>
            ) : (
              <Input.Group compact>
                <Input
                  style={{
                    height: 30,
                    width: "55%",
                  }}
                  placeholder={`$${record.fine_amount}`}
                  onChange={onChange}
                />
                <CustomButton
                  extra_small
                  onClick={() => processSinglePayment(record)}
                >
                  Submit
                </CustomButton>
              </Input.Group>
            )
          ) : (
            <span>NO PAYMENT DUE</span>
          ),
      },
    ];
    return (
      <Table
        rowKey={(record) => record.loan_id}
        dataSource={record.borrower_fines}
        columns={columns}
        pagination={false}
      />
    );
  };

  // TODO STYLE THE SPANS
  const columns = [
    {
      title: "Borrower ID",
      dataIndex: "card_id",
      key: 1,
      align: "center",
      width: 150,
    },
    {
      title: "Name",
      dataIndex: "bname",
      key: 2,
      align: "center",
      width: 200,
    },
    {
      title: "SSN",
      dataIndex: "ssn",
      key: 3,
      align: "center",
    },
    {
      title: "Total Fine Amount",
      dataIndex: "total_fine_amount",
      key: 4,
      align: "center",
      render: (_, { total_fine_amount }) => <span>${total_fine_amount}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: 5,
      align: "center",
      width: !clickedFullPay ? 150 : 200,
      render: (_, record) =>
        record.total_fine_amount ? (
          !clickedFullPay ? (
            <CustomButton onClick={() => startBatchPayment(record)} small>
              Pay All Fines
            </CustomButton>
          ) : (
            <Input.Group compact>
              <Input
                style={{
                  height: 30,
                  width: "55%",
                  fontSize: 15,
                }}
                placeholder={`$${record.total_fine_amount}`}
                onChange={onChange}
              />
              <CustomButton
                extra_small
                onClick={() => processBatchPayment(record)}
              >
                Submit
              </CustomButton>
            </Input.Group>
          )
        ) : (
          <span>NO PAYMENT DUE</span>
        ),
    },
  ];

  return (
    <div>
      <div className="flex justify-center">
        {!filtered ? (
          <CustomButton onClick={handleFiltering}>
            Filter Paid Fines
          </CustomButton>
        ) : (
          <CustomButton onClick={handleReset}>Reset</CustomButton>
        )}
        <CustomButton onClick={handleTableRefresh}>Refresh Fines</CustomButton>
      </div>
      <Table
        pagination={{
          position: ["bottomCenter"],
        }}
        rowKey={(record) => record.card_id}
        expandable={{
          expandedRowRender,
          defaultExpandAllRows: false,
          rowExpandable: (record) => record.borrower_fines.length,
        }}
        columns={columns}
        dataSource={outerTableData}
      />
    </div>
  );
};

export default FinesPage;
