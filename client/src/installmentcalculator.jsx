import React, { useState, useEffect } from 'react';
import './SalaryCalculator.css';

const SalaryCalculator = () => {
  const [selectedWeeks, setSelectedWeeks] = useState(4);
  const [cashPrice, setCashPrice] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [weeklyInstallment, setWeeklyInstallment] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const weeklyMultipliers = {
    4: 1.3,
    8: 1.4,
    12: 1.5,
    16: 1.6,
    20: 1.7,
    24: 1.8,
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculatePayments = () => {
    // Calculate deposit (40% of cash price)
    const deposit = cashPrice * 0.4;
    setDepositAmount(deposit);

    // Calculate remaining balance after deposit
    const remainingBalance = cashPrice - deposit;

    // Get multiplier for selected weeks
    const multiplier = weeklyMultipliers[selectedWeeks] || 1.0;

    // Calculate weekly installment
    const weekly = (remainingBalance / selectedWeeks) * multiplier;
    setWeeklyInstallment(weekly);

    // Calculate end date if start date is selected
    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + selectedWeeks * 7);
      setEndDate(end.toISOString().split('T')[0]);
    }
  };

  useEffect(() => {
    calculatePayments();
  }, [cashPrice, selectedWeeks, startDate]);

  const handleCashPriceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setCashPrice(value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleWeeksChange = (weeks) => {
    setSelectedWeeks(weeks);
  };

  const generatePaymentSchedule = () => {
    const schedule = [];
    if (startDate) {
      for (let i = 0; i < selectedWeeks; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (i + 1) * 7);
        schedule.push({
          week: i + 1,
          date: date.toISOString().split('T')[0],
          amount: weeklyInstallment,
        });
      }
    } else {
      for (let i = 0; i < selectedWeeks; i++) {
        schedule.push({
          week: i + 1,
          date: null,
          amount: weeklyInstallment,
        });
      }
    }
    return schedule;
  };

  const totalToPay = depositAmount + weeklyInstallment * selectedWeeks;
  const interestAmount = totalToPay - cashPrice;
  const paymentSchedule = generatePaymentSchedule();

  const SummaryDialog = () => (
    <div className="modal-overlay" onClick={() => setShowSummary(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Payment Summary</h2>
        <div className="summary-content">
          <div className="summary-item">
            <span>Cash Price</span>
            <span>Ksh {cashPrice.toFixed(2)}</span>
          </div>
          <div className="divider"></div>
          {startDate && (
            <>
              <div className="summary-item">
                <span>Start Date</span>
                <span>{formatDateShort(startDate)}</span>
              </div>
              <div className="summary-item">
                <span>End Date</span>
                <span>{formatDateShort(endDate)}</span>
              </div>
              <div className="divider"></div>
            </>
          )}
          <div className="summary-item">
            <span>Deposit (40%)</span>
            <span>Ksh {depositAmount.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Number of Weeks</span>
            <span>{selectedWeeks} weeks</span>
          </div>
          <div className="summary-item">
            <span>Multiplier</span>
            <span>{weeklyMultipliers[selectedWeeks]}x</span>
          </div>
          <div className="summary-item">
            <span>Weekly Installment</span>
            <span>Ksh {weeklyInstallment.toFixed(2)}</span>
          </div>
          <div className="divider"></div>
          <div className="summary-item">
            <span>Total Weekly Payments</span>
            <span>Ksh {(weeklyInstallment * selectedWeeks).toFixed(2)}</span>
          </div>
          <div className="summary-item bold">
            <span>Total to Pay</span>
            <span>Ksh {totalToPay.toFixed(2)}</span>
          </div>
          <div className="summary-item red">
            <span>Interest Amount</span>
            <span>Ksh {interestAmount.toFixed(2)}</span>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setShowSummary(false)}>
            Close
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              setShowSummary(false);
              alert('Payment plan confirmed!');
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="salary-calculator">
      <div className="app-bar">
        <h1>Installment Calculator</h1>
      </div>

      <div className="content">
        {/* Cash Price Input */}
        <div className="card">
          <h2>Cash Price</h2>
          <div className="input-group">
            <label htmlFor="cashPrice">Enter Cash Price</label>
            <input
              type="number"
              id="cashPrice"
              placeholder="0.00"
              onChange={handleCashPriceChange}
            />
            <span className="input-prefix">Ksh</span>
          </div>
        </div>

        {/* Date Selection */}
        <div className="card">
          <h2>Payment Start Date</h2>
          <div className="date-input-group">
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              min={new Date().toISOString().split('T')[0]}
            />
            <span className="calendar-icon">📅</span>
          </div>
          {startDate && (
            <div className="selected-date">
              {formatDate(startDate)}
            </div>
          )}
          {startDate && endDate && (
            <div className="end-date-info">
              <span className="check-icon">✓</span>
              <span>Payment ends on {formatDate(endDate)}</span>
            </div>
          )}
        </div>

        {/* Weeks Selection */}
        <div className="card">
          <h2>Number of Weeks</h2>
          <div className="weeks-chips">
            {[4, 8, 12, 16, 20, 24].map((weeks) => (
              <button
                key={weeks}
                className={`chip ${selectedWeeks === weeks ? 'selected' : ''}`}
                onClick={() => handleWeeksChange(weeks)}
              >
                {weeks} weeks
              </button>
            ))}
          </div>
          <p className="multiplier-text">
            Multiplier: {weeklyMultipliers[selectedWeeks]}x
          </p>
        </div>

        {/* Calculation Results */}
        <div className="card results-card">
          <h2>Payment Breakdown</h2>
          <div className="divider"></div>
          <div className="result-row">
            <span>Cash Price:</span>
            <span>Ksh {cashPrice.toFixed(2)}</span>
          </div>
          <div className="result-row highlight">
            <span>Deposit (40%):</span>
            <span>Ksh {depositAmount.toFixed(2)}</span>
          </div>
          <div className="result-row highlight">
            <span>Weekly Installment:</span>
            <span>Ksh {weeklyInstallment.toFixed(2)}</span>
          </div>
          <div className="result-row">
            <span>Number of Weeks:</span>
            <span>{selectedWeeks} weeks</span>
          </div>
        </div>

        {/* Payment Schedule */}
        {cashPrice > 0 && (
          <div className="card">
            <h2>Payment Schedule</h2>
            <div className="payment-schedule">
              <div className="schedule-item deposit-item">
                <div className="schedule-icon deposit-icon">💳</div>
                <div className="schedule-info">
                  <div className="schedule-title">
                    {startDate
                      ? `Initial Deposit - ${formatDateShort(startDate)}`
                      : 'Initial Deposit'}
                  </div>
                </div>
                <div className="schedule-amount deposit-amount">
                  Ksh {depositAmount.toFixed(2)}
                </div>
              </div>
              <div className="divider"></div>
              <div className="schedule-list">
                {paymentSchedule.map((payment) => (
                  <div key={payment.week} className="schedule-item">
                    <div className="schedule-icon">{payment.week}</div>
                    <div className="schedule-info">
                      <div className="schedule-title">
                        {payment.date
                          ? `Week ${payment.week} - ${formatDateShort(payment.date)}`
                          : `Week ${payment.week}`}
                      </div>
                    </div>
                    <div className="schedule-amount">
                      Ksh {payment.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View Summary Button */}
        <button
          className="btn-view-summary"
          disabled={cashPrice <= 0}
          onClick={() => setShowSummary(true)}
        >
          View Payment Summary
        </button>
      </div>

      {showSummary && <SummaryDialog />}
    </div>
  );
};

export default SalaryCalculator;