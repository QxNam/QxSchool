import numpy as np
import cv2

def transform(gray):
    for _ in range(3):
        gray[gray <= np.min(gray)] = np.max(gray)
    kernel = np.ones((3, 3), np.uint8)
    gray = cv2.erode(gray, kernel, iterations=1)
    # gray = cv2.dilate(gray, kernel, iterations=1)
    return gray