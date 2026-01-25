# ChainCarbon Performance Testing Guide

This directory contains the Apache JMeter test plan for testing the ChainCarbon blockchain API.

## 📂 Files
- `ChainCarbon_Performance_Test.jmx`: The JMeter test plan file.

## 🚀 Prerequisites
- Apache JMeter installed (download from [jmeter.apache.org](https://jmeter.apache.org/download_jmeter.cgi)).
- ChainCarbon Network running.
- ChainCarbon API Server running on port `3000`.

## 🧪 Scenarios
The test plan covers:
1. **Invoke (Write)**: `POST /certificates` (Creates a new certificate)
2. **Query (Read)**: `GET /certificates/available` (Lists available certificates)

## 🖥️ Running Tests

### Option 1: GUI Mode (For debugging)
1. Open JMeter.
2. File > Open > `tests/ChainCarbon_Performance_Test.jmx`.
3. Adjust "User Defined Variables" if needed (default `USERS=10`).
4. Click the **Start** button.

### Option 2: CLI Mode (For actual testing)
Run the following commands to execute tests. We use the manually installed JMeter since the system version is too old.

```bash
# Set JMeter Path
export JMETER_BIN=~/chaincarbon/tools/apache-jmeter-5.6.3/bin/jmeter

# 10 Users
$JMETER_BIN -n -t ChainCarbon_Performance_Test.jmx -l results_10u.jtl -e -o report_10u -Jusers=10

# 50 Users
$JMETER_BIN -n -t ChainCarbon_Performance_Test.jmx -l results_50u.jtl -e -o report_50u -Jusers=50

# 100 Users
$JMETER_BIN -n -t ChainCarbon_Performance_Test.jmx -l results_100u.jtl -e -o report_100u -Jusers=100

# 150 Users
$JMETER_BIN -n -t ChainCarbon_Performance_Test.jmx -l results_150u.jtl -e -o report_150u -Jusers=150

# 200 Users
$JMETER_BIN -n -t ChainCarbon_Performance_Test.jmx -l results_200u.jtl -e -o report_200u -Jusers=200
```

### 📊 Understanding Results
- Open `report_XXu/index.html` in your browser to view the HTML Dashboard.
- Look at **Statistics** table for:
  - **Throughput**: Transactions per second.
  - **Average**: Average response time.
  - **Error %**: Percentage of failed requests.
