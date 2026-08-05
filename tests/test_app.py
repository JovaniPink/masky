import unittest

from app import create_app


class AppSmokeTest(unittest.TestCase):
    def setUp(self):
        self.client = create_app({"TESTING": True}).test_client()

    def test_home_page_renders(self):
        self.assertEqual(self.client.get("/").status_code, 200)

    def test_api_index_responds(self):
        response = self.client.get("/index")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"status": 200})


if __name__ == "__main__":
    unittest.main()
