import os
import urllib.request
from urllib.parse import urlparse

# Ensure directory exists
output_dir = "public/assets/community"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Unique image URLs from HTML snippet provided
image_urls = [
    "https://northmind.store/cdn/shop/files/1.png?v=1764975378&width=800",
    "https://northmind.store/cdn/shop/files/2.png?v=1764975378&width=800",
    "https://northmind.store/cdn/shop/files/3.png?v=1764975378&width=800",
    "https://northmind.store/cdn/shop/files/4.png?v=1765483312&width=800",
    "https://northmind.store/cdn/shop/files/5.png?v=1764975378&width=800"
]

print(f"Scraping {len(image_urls)} unique images...")

for url in image_urls:
    # Extract filename from path (e.g., 1.png)
    parsed_url = urlparse(url)
    filename = os.path.basename(parsed_url.path)
    
    # Target path
    filepath = os.path.join(output_dir, filename)
    
    # Prepend 'https:' if snippet URLs start with '//' (handled above)
    print(f"Downloading {url} to {filepath}...")
    
    try:
        # Create opener to bypass simple user-agent blocks if they exist
        opener = urllib.request.build_opener()
        opener.addheaders = [('User-Agent', 'Mozilla/5.0')]
        urllib.request.install_opener(opener)
        
        urllib.request.urlretrieve(url, filepath)
        print(f"Successfully saved {filename}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")

print("Scraping finished.")
