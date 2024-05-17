from http.server import SimpleHTTPRequestHandler, HTTPServer
import urllib.parse

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="./", **kwargs)

    def translate_path(self, path):
        # Add prefix to the URL path
        path = super().translate_path(path)
        components = path.split('/')
        components.pop(1)
        #components.insert(1, 'project-2024-datatouille')
        modified_path = '/'.join(components)
        return modified_path

def run(server_class=HTTPServer, handler_class=CustomHTTPRequestHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on port {port}...")
    httpd.serve_forever()

if __name__ == "__main__":
    run()

