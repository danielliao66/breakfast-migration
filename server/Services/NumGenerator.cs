using System.Threading;

namespace BreakfastServer.Services;

public interface INumGenerator
{
    public int GetNext();
}

public class NumGenerator : INumGenerator
{
    private int _currentNum = 0;

    public int GetNext()
    {
        return Interlocked.Increment(ref _currentNum);
    }
}