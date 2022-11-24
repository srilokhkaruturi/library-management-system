import { useEffect } from "react";

// styles
import "./HomePage.styles.scss";

// components
import Search from "../components/Search";
import StatCard from "../components/StatCard";

// redux imports
import { getBooks } from "../redux/books/books.utils";
import { getBorrowers } from "../redux/borrowers/borrowers.utils";
import { getLoans } from "../redux/loans/loans.utils";
import { getAuthors } from "../redux/authors/authors.utils";

import { SelectBookCount } from "../redux/books";
import { SelectAuthorCount } from "../redux/authors";
import { SelectBorrowerCount } from "../redux/borrowers";
import { SelectLoanCount } from "../redux/loans";
import { useDispatch, useSelector } from "react-redux";

const HomePage = () => {
  const dispatch = useDispatch();
  // get the total number of books
  const bookCount = useSelector(SelectBookCount);
  const borrowerCount = useSelector(SelectBorrowerCount);
  const authorCount = useSelector(SelectAuthorCount);
  const loanCount = useSelector(SelectLoanCount) || 1000;

  useEffect(() => {
    dispatch(getBooks());
    dispatch(getBorrowers());
    dispatch(getAuthors());
    dispatch(getLoans());
  }, [dispatch]);

  return (
    <div>
      <div className="bg-[#d9d9d9] w-screen">
        <div className={"flex flex-col items-center "}>
          <div className="m-8">
            <Search />
          </div>
          <div className={"flex flex-wrap space-x-10 m-2"}>
            <StatCard Name={"Books"} Amount={bookCount} />
            <StatCard Name={"Authors"} Amount={authorCount} />
            <StatCard Name={"Borrowers"} Amount={borrowerCount} />
            <StatCard Name={"Loans"} Amount={loanCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
