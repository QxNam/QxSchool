from time import sleep
import undetected_chromedriver.v2 as uc
from selenium.webdriver.common.by import By
import requests
from io import BytesIO
from PIL import Image
import cv2
import numpy as np
import matplotlib.pyplot as plt

options = uc.ChromeOptions()
options.headless = False

class CrawlImage():
    def __init__(self, url = "https://sv.iuh.edu.vn/sinh-vien-dang-nhap.html"):
        self.url = url
        self.driver = uc.Chrome(options=options)

    def get_captcha(self):
        # Open the URL
        self.driver.get(self.url)
        sleep(1)
        # Find the image element using XPATH
        element = self.driver.find_element(by = By.XPATH, value = f"//*[@id='newcaptcha']")
        sleep(1)
        # Get the image URL and download the image
        image_url = element.get_attribute('src')
        response = requests.get(image_url)
        # get the image
        image = Image.open(BytesIO(response.content))
        return np.array(image)

    def show(self, image):
        plt.imshow(image)
        plt.title("SIZE: " + str(image.shape))
        plt.show()
    
    def fresher_captcha(self):
        self.driver.find_element(by = By.XPATH, value = '//*[@id="form-login"]/div/div[2]/div[2]/div[1]/a').click()
    
    def save(self, image, name, path):
        image.save(path + name + ".png")

crawl = CrawlImage()
image = crawl.get_captcha()
crawl.driver.close()