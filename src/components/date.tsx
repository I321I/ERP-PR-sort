import React, { forwardRef, useState } from "react";
import DatePicker, { type ReactDatePickerCustomDayNameProps, type ReactDatePickerCustomHeaderProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from './Date.module.scss'
import { addDays, addMonths, getMonth, setMonth } from "date-fns";

interface DateSelector {
    onChange: (date: string) => void
}
type ExampleCustomInputProps = {
    className?: string;
    value?: string;
    onClick?: () => void;
};

const ExampleCustomInput = forwardRef<
    HTMLButtonElement,
    ExampleCustomInputProps
>(({ value, onClick, className }, ref) => {
    return (
        <button type="button" className={className} onClick={onClick} ref={ref}>
            {!value && (<div className={`${styles.textBeforeSelected}`}>檔案產生日期</div>)}
            {value}
        </button>
    )
})
ExampleCustomInput.displayName = "ExampleCustomInput";

export const DateSelector: React.FC<DateSelector> = ({ onChange }) => {
    const [startDate, setStartDate] = useState<Date | null>();
    const renderHeader = ({
        monthDate,
        customHeaderCount,
        decreaseMonth,
        increaseMonth,
    }: ReactDatePickerCustomHeaderProps) => {
        const today = (JSON.stringify(new Date().getFullYear()) + "/" +
            JSON.stringify(JSON.parse(JSON.stringify(new Date().getMonth())) + 1))
        const calendarDate = (JSON.stringify(monthDate.getFullYear()) + "/" +
            JSON.stringify(JSON.parse(JSON.stringify(monthDate.getMonth())) + 1))
        return (
            <div>
                <button
                    aria-label="Previous Month"
                    className={
                        "react-datepicker__navigation react-datepicker__navigation--previous"
                    }
                    onClick={decreaseMonth}
                    style={{ visibility: customHeaderCount === 0 ? "visible" : "hidden" }}
                >
                    <span
                        className={
                            "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
                        }
                    >
                        {"<"}
                    </span>
                </button>
                <span className={`${styles.calendarHeaderText} react-datepicker__current-month`}>
                    {monthDate.toLocaleString("en-US", {
                        year: "numeric",
                    })}
                    {"年"}
                    {monthDate.toLocaleString("en-US", {
                        month: "2-digit",
                    })}
                    {"月"}
                </span>
                <button
                    aria-label="Next Month"
                    className={
                        "react-datepicker__navigation react-datepicker__navigation--next"
                    }
                    onClick={increaseMonth}
                    style={{
                        visibility:
                            calendarDate !== today ? "visible" : "hidden",
                    }}
                >
                    <span
                        className={
                            "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
                        }
                    >
                        {">"}
                    </span>
                </button>
            </div>
        )
    };
    const renderDayName = ({
        fullName,
    }: ReactDatePickerCustomDayNameProps): React.ReactNode => {
        // Example: Add emoji or custom styling to day names
        // Apply different styling based on customDayNameCount when showing multiple months
        const week: { [key: string]: string } = {
            Monday: "一",
            Tuesday: "二",
            Wednesday: "三",
            Thursday: "四",
            Friday: "五",
            Saturday: "六",
            Sunday: "日",
        };
        return (
            <>
                <span className="react-datepicker__sr-only">{fullName}</span>
                <span aria-hidden="true" title={fullName} >
                    {week[fullName]}
                </span>
            </>
        );
    };
    return <DatePicker
        showIcon
        icon={
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 7 48 48"><mask id="ipSApplication0"><g fill="none" stroke="#fffcfc" strokeLinejoin="round" strokeWidth="4"><path strokeLinecap="round" d="M40.04 22v20h-32V22"></path><path fill="#ffffff" d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"></path></g></mask><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSApplication0)"></path></svg>}
        dateFormat="yyyy/MM/dd"
        renderCustomHeader={renderHeader}
        renderCustomDayName={renderDayName}
        customInput={<ExampleCustomInput className="example-custom-input" />}
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
        placeholderText="檔案產生日期"
        maxDate={addMonths(new Date(), 0)}
        disabledKeyboardNavigation
    />;
};