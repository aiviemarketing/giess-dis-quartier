"""Offline unit tests for the manual local CPC runner."""

from __future__ import annotations

from datetime import datetime, timezone
import unittest

from gdq.cpc import run


class RunCpcTests(unittest.TestCase):
    def test_timestamp_requires_a_timezone(self) -> None:
        with self.assertRaises(Exception):
            run.parse_timestamp("2026-08-15T11:00:00")

    def test_timestamp_normalizes_to_utc(self) -> None:
        self.assertEqual(
            run.parse_timestamp("2026-08-15T13:00:00+02:00"),
            datetime(2026, 8, 15, 11, tzinfo=timezone.utc),
        )

    def test_subprocess_command_uses_current_python(self) -> None:
        invocation = run.command("ingest", "--file", "sample.h5")
        self.assertEqual(invocation[:2], [run.sys.executable, "-m"])
        self.assertEqual(invocation[2], "gdq.cpc.ingest")
        self.assertEqual(invocation[3:], ["--file", "sample.h5"])

    def test_hourly_timestamps_are_oldest_first(self) -> None:
        end = datetime(2026, 8, 15, 11, 15, tzinfo=timezone.utc)
        self.assertEqual(
            run.hourly_timestamps(end, 3),
            [
                datetime(2026, 8, 15, 9, 15, tzinfo=timezone.utc),
                datetime(2026, 8, 15, 10, 15, tzinfo=timezone.utc),
                end,
            ],
        )

    def test_hourly_timestamps_require_a_positive_count(self) -> None:
        with self.assertRaises(ValueError):
            run.hourly_timestamps(datetime.now(timezone.utc), 0)


if __name__ == "__main__":
    unittest.main()
