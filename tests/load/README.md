# Load Testing

Load tests evaluate system performance, scalability, and reliability under stress conditions.

## Purpose

- Measure API response times
- Identify performance bottlenecks
- Verify system behavior under load
- Establish performance baselines
- Stress test infrastructure

## Tools

### Apache Bench (ab)
- Simple HTTP load testing
- Good for quick benchmarks
- Comes with Apache installation

### k6 (Optional)
For advanced load testing scenarios:
```bash
k6 run tests/load/k6-script.js
```

## Running Load Tests

### Basic Load Test
```bash
make load-test
```

### Custom Configuration
```bash
./scripts/load-test.sh --concurrent 50 --requests 5000
```

### Against Production
```bash
./scripts/load-test.sh --url https://api.production.com --concurrent 100
```

## Metrics

Load tests measure:
- **Throughput**: Requests per second
- **Response Time**: Min, avg, max latencies
- **Error Rate**: Failed requests percentage
- **P95/P99**: 95th/99th percentile response times
- **Connection Time**: Time to establish connection
- **Processing Time**: Server processing duration

## Performance Targets

- API Response Time: < 200ms (p95)
- Throughput: > 100 req/s
- Error Rate: < 0.1%
- System Memory: < 80% utilization

## Result Analysis

Results are saved to `load-test-results/` directory:
```
load-test-results/
├── load-test-20240702_120000.txt
├── data-api-health-20240702_120000.tsv
└── ...
```

## Best Practices

1. **Run During Off-Peak**: Test on non-production environments
2. **Baseline Establishment**: Record baseline metrics
3. **Gradual Ramp-Up**: Start with low concurrency, increase gradually
4. **Monitor Infrastructure**: Watch CPU, memory, disk during tests
5. **Analyze Bottlenecks**: Use profiling tools to identify issues
6. **Document Results**: Keep historical records for comparison

## Troubleshooting

- **Connection Refused**: Verify API is running and accessible
- **Timeout Errors**: Increase timeout values or reduce concurrency
- **High Error Rate**: Check API logs for errors
- **Memory Spikes**: Monitor application memory usage
