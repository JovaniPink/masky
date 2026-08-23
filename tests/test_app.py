import unittest

from app import create_app


class AppSmokeTest(unittest.TestCase):
    def setUp(self):
        self.client = create_app({"TESTING": True}).test_client()

    def test_home_page_renders(self):
        self.assertEqual(self.client.get("/").status_code, 200)

    def test_home_page_pins_external_browser_dependencies(self):
        page = self.client.get("/").get_data(as_text=True)

        self.assertIn(
            "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js",
            page,
        )
        self.assertIn(
            "sha384-KIix3a0qkeD2RPwPvpkJ+Knc91vkmDI+i2c7phIO+EfV3dpfDXIGSqQjpIaJXlR9",
            page,
        )
        self.assertIn(
            "https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js",
            page,
        )
        self.assertIn(
            "sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i",
            page,
        )
        self.assertIn("https://cdn.plot.ly/plotly-1.58.5.min.js", page)
        self.assertIn(
            "sha384-W7FXNbEY44RgDK8MunBe4gETSKi3Qo2bJAXX3PH8v5l3hdabFb9dbCIn3X69OFjX",
            page,
        )
        self.assertNotIn("plotly-latest.min.js", page)

    def test_api_index_responds(self):
        response = self.client.get("/index")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"status": 200})


if __name__ == "__main__":
    unittest.main()
