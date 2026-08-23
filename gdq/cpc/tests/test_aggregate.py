import unittest

from gdq.cpc.aggregate import timestamp


class AggregateCpcToTreesTests(unittest.TestCase):
    def test_accepts_cpc_utc_timestamp(self):
        self.assertEqual(timestamp("2026-08-15T11:00:00Z").isoformat(), "2026-08-15T11:00:00")

    def test_rejects_invalid_timestamp(self):
        with self.assertRaises(Exception):
            timestamp("not-a-timestamp")


if __name__ == "__main__":
    unittest.main()
