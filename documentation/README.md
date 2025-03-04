# Documentation

## About This Document

This document is **authoritative** — if it disagrees with any code, the discrepancy is a bug in the code.  
This document describes the norms and expectations for any documentation relating to the code. This primarily applies to any other files in the `/documentation/` directory.  

## How to Use it

* To find the relevant documentation about a given piece of code, check `/documentation/{the relevant subdirectory}`.
  * If a document is **authoritative**, you should read it before working with the relevant code. If not, it might be a useful resource, but reading it is optional.
* If you want to call a function within that code or connect it to something else, refer to the `How to Use it` section of that document for details about what the code does and how to use it (i.e. API calls, interfaces, method signatures, etc).
* If you want to make changes to that code, refer to the `How it Works` section of that document for details about internal structure and mechanisms, as well as anything to keep in mind when contributing.

## How it Works

* **REMINDER: You don't have to read this section if you're not writing any documentation.**
* Relevant documentation about pieces of code should be contained in the relvant subdirectories in `/documentation/`. For example, information about the deployment structure should be included in `/documentation/deployment/`.
  * Feel free to make deeper subdirectories when necessary, but try not to overdo it.
* Documentation files like this one should maintain the same structure if possible. Additional headers can be added if necessary for clarity.
  * **About this Document** - This section describes the purpose of the document. It should specify what code it relates to and what it is aiming to describe about the code.
  * **How to Use it** - This section describes what the code actually does, including how the code fits into the codebase and what function it serves. As a rule of thumb, remember that other devs should be able to use your code (instantitate classes, call methods, etc.) after reading only this section.
  * **How it Works** - This section describes the internals of the code, including how the components within the code work with one another. As a rule of thumb, remember that other devs should be able to reference this section to fully understand and make meaningful changes to this code.
* When considering adding documentation, first ask if the details can be a comment instead. **Comments are preferred** for any documentation about a specific, localized piece of code. Only create a document here if the information cannot be expressed in a comment (e.g. wireframes) or must be known before editing any piece of related code (e.g. containerization structure).
  * For method documentation, use [summary comments](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/documentation-comments) instead.
  * For confusion points or other "gotcha"s, use standard in-line comments instead.
* Dedicated documentation files should specify if they are authoritative or supplemental. Authoritative documents are those that prescribe how the code *should* work (e.g. structural outlines), while supplemental documents describe how the code *does* work (e.g. usage guides). Most documents should be supplemental.
  * Remember that each authoritative document in the repo increases turnaround time on new features. If an authoritative document isn't necessary, don't include it. If it is, keep it minimal.
  * For consistency, include this line at the top of authoritative documents: `This document is **authoritative** — if it disagrees with any code, the discrepancy is a bug in the code.`
  * Unmarked documents are assumed to be supplemental. If clarity is needed, add this line to supplemental documents: `This document is **supplemental** — if it disagrees with any code, the discrepancy is a problem with this document.`
* **Never push (or allow) an update to code that goes against authoritative documents**. If the requirements of the code change, always edit the relevant document before editing the code itself.
