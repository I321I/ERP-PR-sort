import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from './Date.module.scss'
import { useAppDispatch, useAppSelector } from "../main";
import { useDispatch } from "react-redux";
import { reactHooksModule } from "@reduxjs/toolkit/query/react";

interface DateSelector {
    onChange: (date: string) => void
}
//Custom Day Class Name
export const DateSelector: React.FC<DateSelector> = ({ onChange }) => {
    const [startDate, setStartDate] = useState<Date | null>();
    return <DatePicker
        showIcon
        icon={
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="5 2 48 48"><mask id="ipSApplication0"><g fill="none" stroke="#fffcfc" strokeLinejoin="round" strokeWidth="4"><path strokeLinecap="round" d="M40.04 22v20h-32V22"></path><path fill="#ffffff" d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"></path></g></mask><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSApplication0)"></path></svg>}
        dateFormat="yyyy/MM/dd"
        selected={startDate}
        onChange={(date: Date | null) => {
            setStartDate(date);
            onChange(
                JSON.stringify(date?.getFullYear()) + "/" +
                JSON.stringify(JSON.parse(JSON.stringify(date?.getMonth())) + 1) + "/" +
                JSON.stringify(date?.getDate())
            );

        }}
        className={`${styles.date}`}
        disabledKeyboardNavigation
        placeholderText="檔案產生日期"
    />;
};