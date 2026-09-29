from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 10)

# Open Login Page
driver.get("http://127.0.0.1:8000/login/")

# =========================================================
# 1. INTERFACE TEST
# =========================================================

wait.until(EC.visibility_of_element_located((By.ID, "loginForm")))
wait.until(EC.visibility_of_element_located((By.ID, "email")))
wait.until(EC.visibility_of_element_located((By.ID, "password")))
wait.until(EC.visibility_of_element_located((By.ID, "loginBtn")))
wait.until(EC.visibility_of_element_located((By.ID, "guestBtn")))

print("Interface Test Passed")


# =========================================================
# 2. FUNCTIONAL TEST
# =========================================================

email = driver.find_element(By.ID, "email")
password = driver.find_element(By.ID, "password")

email.send_keys("test@college.edu")
password.send_keys("wrongpassword")

login_button = driver.find_element(By.ID, "loginBtn")

driver.execute_script(
    "arguments[0].scrollIntoView({block: 'center'});",
    login_button
)

time.sleep(1)

driver.execute_script(
    "arguments[0].click();",
    login_button
)

time.sleep(2)

print("Login button functional test completed")


# =========================================================
# 3. NEGATIVE TEST
# =========================================================

# Open login page again
driver.get("http://127.0.0.1:8000/login/")

wait.until(
    EC.visibility_of_element_located((By.ID, "email"))
)

wait.until(
    EC.visibility_of_element_located((By.ID, "password"))
)

# Leave email and password empty
login_button = driver.find_element(By.ID, "loginBtn")

driver.execute_script(
    "arguments[0].scrollIntoView({block: 'center'});",
    login_button
)

time.sleep(1)

driver.execute_script(
    "arguments[0].click();",
    login_button
)

time.sleep(1)

print("Negative Login Test Completed")


# =========================================================
# 4. USABILITY TEST
# =========================================================

toggle_password = wait.until(
    EC.visibility_of_element_located((By.ID, "togglePassword"))
)

forgot_link = wait.until(
    EC.visibility_of_element_located((By.ID, "forgotLink"))
)

guest_button = wait.until(
    EC.visibility_of_element_located((By.ID, "guestBtn"))
)

assert toggle_password.is_displayed()
assert forgot_link.is_displayed()
assert guest_button.is_displayed()

print("Usability Test Passed")


# =========================================================
# FINISH
# =========================================================

driver.quit()

print("All Selenium tests completed successfully")
# Intentional failure for CI demonstration
assert False, "Intentional test failure for CI demonstration"